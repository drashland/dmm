import {colours} from "../deps.ts";
import Module from "./interfaces/module.ts"

export function standardiseVersion (importedVersion: string, latestVersion: string): string {
  const importedVersionHasV = importedVersion.indexOf("v") === 0;
  const latestVersionHasV = latestVersion.indexOf("v") === 0;

  if (importedVersionHasV && !latestVersionHasV) {
    latestVersion = "v" + latestVersion;
    return latestVersion
  }

  if (!importedVersionHasV && latestVersionHasV) {
    latestVersion = latestVersion.substring(1);
    return latestVersion
  }

  return latestVersion
}

interface DenoLandDatabase {
  [key: string]: {
    name: string;
    repo: string;
    desc: string;
    owner: string
  }
}
/**
 * @description
 * Fetches Deno's `database.json` from the `deno_website2` GitHub repo
 *
 * @return {Promise<[key: string]: DenoLandDatabaseModule>} All 3rd party modules in Deno's registry
 */
async function getDenoLandDatabase(): Promise<DenoLandDatabase> {
  const res = await fetch(
      "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json",
  );
  const denoDatabase: DenoLandDatabase = await res.json();
  return denoDatabase;
}
export const denoLandDatabase: DenoLandDatabase = await getDenoLandDatabase();

/**
 * @description
 * Fetches the latest std version
 *
 * @returns {Promise<string>} eg "0.57.0"
 */
async function getLatestStdRelease(): Promise<string> {
  const res = await fetch(
      "https://raw.githubusercontent.com/denoland/deno_website2/master/deno_std_versions.json",
  );
  const versions: string[] = await res.json();
  let latestVersion = versions[0];
  return latestVersion;
}
export const latestStdRelease = await getLatestStdRelease()

/**
 * @description
 * Fetches the latest release of a module from it's GitHub repository.
 * Achieves this by reading Deno's `database.json` to get the repository name
 * and owner then sending a fetch request.
 *
 * @param {string} name Module name
 *
 * @returns {Promise<string>} The latest version.
 */
export async function getLatestThirdPartyRelease(name: string): Promise<string> {
  const owner = denoLandDatabase[name].owner;
  const repo = denoLandDatabase[name].repo;
  const res = await fetch(
      "https://github.com/" + owner + "/" + repo + "/releases/latest",
  );
  const url = res.url;
  const urlSplit = url.split("/");
  let latestRelease = urlSplit[urlSplit.length - 1];
  return latestRelease;
}

/**
 * @description
 * Constructs the object representations for the given modules, that contains all the information about those modules
 * needed to: run any queries on them, or log information about them.
 *     1. Reads `deps.ts` and turns each dependency into a module object
 *     2. Adds a the github url to each object using Deno's database.json and the modules name
 *     3. Adds the latest version to each object using the github url
 *
 * @param {string[]} modulesForPurpose Specific modules instead of checking all. Leave empty if all
 * @param {string} purpose The purpose. Purely for logging purposes, eg "check" or "update"
 *
 * @return {Module[]} An array of objects, with each object containing information about each module
 */
export async function constructModulesDataFromDeps(
    modulesForPurpose: string[],
    purpose: string,
): Promise<Module[] | boolean> {

  // Solely read the users `deps.ts` file
  console.info("Reading deps.ts to gather your dependencies...");
  const usersWorkingDir: string = Deno.realPathSync(".");
  const depsContent: string = new TextDecoder().decode(
      Deno.readFileSync(usersWorkingDir + "/deps.ts"),
  ); // no need for a try/catch. The user needs a deps.ts file

  // Turn lines that import from a url into a nice array
  const listOfDeps: string[] = depsContent.split("\n").filter((line) =>
      line.indexOf("https://deno.land") !== -1
  );

  // Collate data for each module imported
  const modules: Array<Module> = [];
  for (const dep of listOfDeps) {

    // Get if is std
    const std: boolean = dep.indexOf("https://deno.land/std") >= 0;

    // Get deno land URL
    const denoLandURL: string = dep.substring(
        dep.lastIndexOf("https://deno.land/"),
        dep.lastIndexOf(".ts") + 3, // to include the `.ts`
    );

    // Get the imported version
    const importVersionRegex = /(v)?[0-9].+[0-9].+[0-9]/g;
    const importVersionRegexResult = dep.match(importVersionRegex);
    const importedVersion: string =
        importVersionRegexResult !== null && importVersionRegexResult.length > 0
            ? importVersionRegexResult[0]
            : "";
    if (!importedVersion) {
      console.error(colours.red(
          "The following line is not versioned. To update, your dependencies must be versioned." +
          "\n" +
          "    " + dep,
      ));
      Deno.exit(1);
    }

    // Get the module name
    const name: string = std === true
        ? (dep.split("@" + importedVersion + "/")[1]).split("/")[0]
        : dep.substring(
            dep.lastIndexOf("/x/") + 3,
            dep.lastIndexOf("@"),
        );

    // Leave the module out if it isn't specified
    if (modulesForPurpose.length && modulesForPurpose.indexOf(name) === -1) {
      continue;
    }

    // Get the github url
    const githubURL: string = std === true
        ? "https://github.com/denoland/deno/std/" + name
        : "https://github.com/" + denoLandDatabase[name].owner + "/" +
        denoLandDatabase[name].repo;

    // Get the latest release - make sure the string is the same format as imported version eg using a "v"
    const latestRelease: string = std === true ?
        standardiseVersion(importedVersion, latestStdRelease)
        :
        standardiseVersion(importedVersion, await getLatestThirdPartyRelease(name));

    // Get the description
    const description: string = std === false
        ? denoLandDatabase[name].desc
        : colours.red("Descriptions for std modules are not currently supported");

    // Save the module
    modules.push({
      std,
      githubURL,
      denoLandURL,
      latestRelease,
      importedVersion,
      name,
      description,
    });
  }

  if (!modules.length) {
    return false;
  }
  return modules;
}