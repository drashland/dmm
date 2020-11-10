import { LoggerService } from "../../deps.ts";
import ModuleService from "../services/module_service.ts";

/**
 * Reads users deps file and will update based on:
 *     - if `dependencies` has items, only update those in users deps file
 *     - if `dependencies` is empty, update all
 *
 * @param dependencies - List of dependencies the user wishes to update
 */
export async function update(dependencies: string[]): Promise<void> {
  // Create objects for each dep, with its name and version
  const allModules = await ModuleService.constructModulesDataFromDeps();
  const modules = allModules.filter((module) => {
    if (dependencies.length) { // only return selected modules of selecting is set
      return dependencies.indexOf(module.name) > -1;
    } else {
      return true;
    }
  });

  if (modules.length === 0) {
    LoggerService.logError(
      "Modules specified do not exist in your dependencies.",
    );
    Deno.exit(1);
  }

  // Check for updates and rewrite `deps.ts` if needed
  LoggerService.logInfo("Checking if your modules can be updated...");
  const usersWorkingDir: string = Deno.realPathSync(".");
  let depsWereUpdated = false;
  let depsContent: string = new TextDecoder().decode(
    Deno.readFileSync(usersWorkingDir + "/deps.ts"),
  ); // no need for a try/catch. The user needs a deps.ts file

  // Update the file content
  modules.forEach((module) => {
    // only re-write modules that need to be updated
    if (module.importedVersion === module.latestRelease) {
      return;
    }
    if (module.std) {
      depsContent = depsContent.replace(
        "std@" + module.importedVersion + "/" + module.name,
        "std@" + module.latestRelease + "/" + module.name,
      );
    } else {
      depsContent = depsContent.replace(
        module.name + "@" + module.importedVersion,
        module.name + "@" + module.latestRelease,
      );
    }
    LoggerService.logInfo(
      module.name + " was updated from " + module.importedVersion + " to " +
        module.latestRelease,
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
    LoggerService.logInfo("Everything is already up to date");
  }
}
