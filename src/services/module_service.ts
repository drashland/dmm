import IModule from "../interfaces/module.ts";
import { colours } from "../../deps.ts";
import DenoService from "../services/deno_service.ts";
import NestService from "../services/nest_service.ts";

export default class ModuleService {
  /**
   * Keeps the latest release string in-line with the imported version.
   * Latest release will contain or lose the "v" prefix to match the
   * imported version
   *
   * @param importedVersion - eg "v1.0.1" or "1.0.1"
   * @param latestVersion - eg "v1.0.1" or "1.0.1"
   *
   * @returns The version eg "v1.0.1" if `importedVersion` is "v1.0.1", else "1.0.1"
   */
  private static standardiseVersion(
    importedVersion: string,
    latestVersion: string,
  ): string {
    const importedVersionHasV = importedVersion.indexOf("v") === 0;
    const latestVersionHasV = latestVersion.indexOf("v") === 0;

    if (importedVersionHasV && !latestVersionHasV) {
      latestVersion = "v" + latestVersion;
      return latestVersion;
    }

    if (!importedVersionHasV && latestVersionHasV) {
      latestVersion = latestVersion.substring(1);
      return latestVersion;
    }

    return latestVersion;
  }

  /**
   * Constructs the object representations for the given modules, that contains all the information about those modules
   * needed to: run any queries on them, or log information about them.
   *     1. Reads `deps.ts` and turns each dependency into a module object
   *     2. Adds a the github url to each object using Deno's database.json and the modules name
   *     3. Adds the latest version to each object using the github url
   *
   * @param modulesForPurpose - Specific modules instead of checking all. Leave empty if all
   * @param purpose - The purpose. Purely for logging purposes, eg "check" or "update"
   *
   * @returns An array of objects, with each object containing information about each module
   */
  public static async constructModulesDataFromDeps(
    modulesForPurpose: string[],
    purpose: string,
  ): Promise<IModule[] | boolean> {
    // Solely read the users `deps.ts` file
    console.info("Reading deps.ts to gather your dependencies...");
    const usersWorkingDir: string = Deno.realPathSync(".");
    const depsContent: string = new TextDecoder().decode(
      Deno.readFileSync(usersWorkingDir + "/deps.ts"),
    ); // no need for a try/catch. The user needs a deps.ts file

    // Turn lines that import from a url into a nice array
    const listOfDeps: string[] = depsContent.split("\n").filter((line) =>
      line.indexOf("https://deno.land") !== -1 ||
      line.indexOf("https://x.nest.land") !== -1
    );

    // Collate data for each module imported
    const modules: Array<IModule> = [];
    for (const dep of listOfDeps) {
      const isDeno = dep.indexOf("https://deno.land/") >= 0;
      const isNest = dep.indexOf("https://x.nest.land/") >= 0;

      // Get if is std
      const isStd: boolean = dep.indexOf("https://deno.land/std") >= 0 ||
        dep.indexOf("https://x.nest.land/std") >= 0;

      // Get URL
      const moduleURL: string = dep.substring(
        dep.lastIndexOf(isDeno ? "https://deno.land/" : "https://x.nest.land/"),
        dep.lastIndexOf(".ts") + 3, // to include the `.ts`
      );

      // Get the imported version
      const importVersionRegex = /(v)?[0-9\.]+[0-9\.]+[0-9]/g;
      const importVersionRegexResult = dep.match(importVersionRegex);
      const importedVersion: string = importVersionRegexResult !== null &&
          importVersionRegexResult.length > 0
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

      const RegistryService = isDeno ? DenoService : NestService;

      // Get the module name
      const name: string = isStd
        ? (dep.split("@" + importedVersion + "/")[1]).split("/")[0]
        : dep.substring(
          dep.lastIndexOf(
            isDeno ? "https://deno.land/x/" : "https://x.nest.land/",
          ) + 20,
          dep.lastIndexOf("@"),
        );

      // Leave the module out if it isn't specified
      if (modulesForPurpose.length && modulesForPurpose.indexOf(name) === -1) {
        continue;
      }

      // Get the repository url (always Github for deno.land but could be something else for nest.land)
      const repositoryURL: string = isStd
        ? "https://github.com/denoland/deno/tree/master/std/" + name
        : await RegistryService.getThirdPartyRepoURL(name);

      // Get the latest release - make sure the string is the same format as imported version eg using a "v"
      const latestRelease: string = isStd
        ? ModuleService.standardiseVersion(
          importedVersion,
          await RegistryService.getLatestModuleRelease("std"),
        )
        : ModuleService.standardiseVersion(
          importedVersion,
          await RegistryService.getLatestModuleRelease(name),
        );

      // Get the description
      const description: string = !isStd
        ? await RegistryService.getThirdPartyDescription(name)
        : colours.red(
          "Descriptions for std modules are not currently supported",
        );

      // Save the module
      modules.push({
        std: isStd,
        repositoryURL,
        moduleURL,
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
}
