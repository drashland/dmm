import IModule from "../interfaces/module.ts";
import {colours, logError, logInfo} from "../../deps.ts";
import DenoService from "../services/deno_service.ts";

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
    logInfo("Reading deps.ts to gather your dependencies...");
    const usersWorkingDir: string = Deno.realPathSync(".");
    const depsContent: string = new TextDecoder().decode(
      Deno.readFileSync(usersWorkingDir + "/deps.ts"),
    ); // no need for a try/catch. The user needs a deps.ts file

    // Turn lines that import from a url into a nice array
    const listOfDeps: string[] = depsContent.split("\n").filter((line) =>
      line.indexOf("https://deno.land") !== -1
    );

    // Collate data for each module imported
    const modules: Array<IModule> = [];
    for (const dep of listOfDeps) {
      // Get if is std
      const std: boolean = dep.indexOf("https://deno.land/std") >= 0;

      // Get deno land URL
      const denoLandURL: string = dep.substring(
        dep.lastIndexOf("https://deno.land/"),
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
        logError(colours.red(
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
        ? "https://github.com/denoland/deno/tree/master/std/" + name
        : "https://github.com/" +
          await DenoService.getThirdPartyRepoAndOwner(name);

      // Get the latest release - make sure the string is the same format as imported version eg using a "v"
      const latestRelease: string = std === true
        ? ModuleService.standardiseVersion(
          importedVersion,
          await DenoService.getLatestModuleRelease("std"),
        )
        : ModuleService.standardiseVersion(
          importedVersion,
          await DenoService.getLatestModuleRelease(name),
        );

      // Get the description
      const description: string = std === false
        ? await DenoService.getThirdPartyDescription(name)
        : colours.red(
          "Descriptions for std modules are not currently supported",
        );

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
}
