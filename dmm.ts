import { colours } from "./deps.ts";

interface Module {
  std: boolean;
  name: string;
  importedVersion: string;
  denoLandURL: string;
  githubURL: string;
  latestRelease: string;
  description: string;
}

//const version = "v1.0.5"
const decoder = new TextDecoder();

// export async function checkDmmVersion () {
//     const res = await fetch("https://api.github.com/repos/drashland/dmm/releases/latest");
//     const json = await res.json()
//     if (json.tag_name && version !== json.tag_name) {
//         console.warn(colours.yellow('A newer version (' + json.tag_name + ') of dmm has been released.'))
//     }
// }

/**
 * @description
 * Fetches Deno's `database.json` from the `deno_website2` GitHub repo
 *
 * @return {Promise<key: string>} All 3rd party modules in Deno's registry
 */
async function getDenoLandDatabase(): Promise<any> {
  const res = await fetch(
    "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json",
  );
  const denoDatabase = await res.json();
  return denoDatabase;
}

async function getStdLatestVersion(): Promise<string> {
  const res = await fetch(
    "https://raw.githubusercontent.com/denoland/deno_website2/master/deno_std_versions.json",
  );
  const versions = await res.json();
  const latestVersion = versions[0];
  return latestVersion;
}

/**
 * @description
 * Constructs the object representations for the users modules, that contains all the information about those modules,
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
async function constructModulesDataFromDeps(
  modulesForPurpose: string[],
  purpose: string,
): Promise<Module[] | boolean> {
  const denoDatabase = await getDenoLandDatabase();
  const latestStdVersion = await getStdLatestVersion();

  async function getLatestReleaseOfGitHubRepo(
    isStd: boolean,
    importedVersion: string,
    name: string,
  ): Promise<string> {
    let latestVersion: string = "";

    if (isStd) {
      latestVersion = latestStdVersion;
    } else {
      const owner = denoDatabase[name].owner;
      const repo = denoDatabase[name].repo;
      const res = await fetch(
        "https://github.com/" + owner + "/" + repo + "/releases/latest",
      );
      const url = res.url;
      const urlSplit = url.split("/");
      const latestRelease = urlSplit[urlSplit.length - 1];
      return latestRelease;
    }

    // If imported version has a `v` and the latest version doesn't then standardise the latest version
    if (
      importedVersion.indexOf("v") === 0 && latestVersion.indexOf("v") === -1
    ) {
      latestVersion = "v" + latestVersion;
    }
    // if imported version has no `v` but latest release does then strip it
    if (
      importedVersion.indexOf("v") === -1 && latestVersion.indexOf("v") === 0
    ) {
      latestVersion = latestVersion.substring(1);
    }
    return latestVersion;
  }

  // Solely read the users `deps.ts` file
  console.info("Reading deps.ts to gather your dependencies...");
  const usersWorkingDir: string = Deno.realPathSync(".");
  const depsContent: string = decoder.decode(
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
      : "https://github.com/" + denoDatabase[name].owner + "/" +
        denoDatabase[name].repo;

    // Get the latest release - make sure the string is the same format as imported version eg using a "v"
    const latestRelease: string = await getLatestReleaseOfGitHubRepo(
      std,
      importedVersion,
      name,
    );

    // Get the description
    const description: string = std === false
      ? denoDatabase[name].desc
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

/**
 * Main logic for purposes of this module.
 */
export const purposes: { [key: string]: Function } = {
  "check": async function (modulesForPurpose: string[]) {
    // Create objects for each dep, with its name and version
    const purpose = "check";
    const modules = await constructModulesDataFromDeps(
      modulesForPurpose,
      purpose,
    );
    if (modules === false || typeof modules === "boolean") {
      console.error(
        colours.red("Modules specified do not exist in your dependencies."),
      );
      Deno.exit(1);
      return;
    }
    // Compare imported and latest version
    console.info("Comparing versions...");
    let depsCanBeUpdated: boolean = false;
    let listOfModuleNamesToBeUpdated: string[] = [];
    modules.forEach((module) => {
      if (module.importedVersion !== module.latestRelease) {
        depsCanBeUpdated = true;
        listOfModuleNamesToBeUpdated.push(module.name);
        console.info(
          colours.yellow(
            module.name + " can be updated from " + module.importedVersion +
              " to " + module.latestRelease,
          ),
        );
      }
    });
    // Logging purposes
    if (depsCanBeUpdated) {
      console.info(
        "To update, run: \n    dmm update " +
          listOfModuleNamesToBeUpdated.join(" "),
      );
    } else {
      console.info(colours.green("Your dependencies are up to date"));
    }
  },
  "update": async function (modulesForPurpose: string[]) {
    // Create objects for each dep, with its name and version
    const purpose = "update";
    const modules = await constructModulesDataFromDeps(
      modulesForPurpose,
      purpose,
    );
    if (modules === false || typeof modules === "boolean") {
      console.error(
        colours.red("Modules specified do not exist in your dependencies."),
      );
      Deno.exit(1);
      return;
    }

    // Check for updates and rewrite `deps.ts` if needed
    console.info("Checking if your modules can be updated...");
    const usersWorkingDir: string = Deno.realPathSync(".");
    let depsWereUpdated = false;
    let depsContent: string = decoder.decode(
      Deno.readFileSync(usersWorkingDir + "/deps.ts"),
    ); // no need for a try/catch. The user needs a deps.ts file
    modules.forEach((module) => {
      // only re-write modules that need to be updated
      if (module.importedVersion === module.latestRelease) {
        return;
      }
      depsContent = depsContent.replace(
        "std@" + module.importedVersion + "/" + module.name,
        "std@" + module.latestRelease + "/" + module.name,
      );
      console.info(
        colours.green(
          module.name + " was updated from " + module.importedVersion + " to " +
            module.latestRelease,
        ),
      );
      depsWereUpdated = true;
    });

    // Re-write the file
    Deno.writeFileSync(
      usersWorkingDir + "/deps.ts",
      new TextEncoder().encode(depsContent),
    );

    // And if none were updated, add some more logging
    if (!depsWereUpdated) {
      console.info(colours.green("Everything is already up to date"));
    }
  },
  "info": async function (modulesForPurpose: string[]) {
    if (modulesForPurpose.length === 0 || modulesForPurpose.length > 1) {
      console.error(
        colours.red(
          "Specify a single module to get information on. See --help",
        ),
      );
      Deno.exit(1);
    }
    const moduleToGetInfoOn = modulesForPurpose[0];
    const purpose = "info";
    const database = await getDenoLandDatabase();
    const stdResponse = await fetch(
      "https://github.com/denoland/deno/tree/master/std/" + moduleToGetInfoOn,
    );
    const isStd = stdResponse.status === 200;
    const isThirdParty = typeof database[moduleToGetInfoOn] === "object";
    if (!isStd && !isThirdParty) {
      console.error(
        colours.red("No module was found with " + moduleToGetInfoOn),
      );
      Deno.exit(1);
    }
    const name = moduleToGetInfoOn;
    let description;
    let denoLandUrl;
    let gitHubUrl;
    let latestVersion;
    if (isStd) {
      latestVersion = await getStdLatestVersion();
      description = "Cannot retrieve descriptions for std modules";
      denoLandUrl = "https://deno.land/std@" + latestVersion + "/" +
        name;
      gitHubUrl = "https://github.com/denoland/deno/tree/master/std/" + name;
    }
    if (isThirdParty) {
      const databaseModule = database[moduleToGetInfoOn];
      description = databaseModule.desc;
      gitHubUrl = "https://github.com/" + databaseModule.owner + "/" +
        databaseModule.repo;
      const res = await fetch(gitHubUrl + "/releases/latest");
      const splitUrl: string[] = res.url.split("/");
      latestVersion = splitUrl[splitUrl.length - 1];
      denoLandUrl = "https://deno.land/x/" + name + "@" + latestVersion;
    }
    const importLine = "import * as " + name + ' from "' + denoLandUrl + '";';
    console.info(
      "\n" +
        `Information on ${name}\n\n  - Name: ${name}\n  - Description: ${description}\n  - deno.land Link: ${denoLandUrl}\n  - GitHub Repository: ${gitHubUrl}\n  - Import Statement: ${importLine}\n  - Latest Version: ${latestVersion}` +
        "\n",
    );
    Deno.exit();
  },
};
