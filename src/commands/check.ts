import { LoggerService} from "../../deps.ts";
import ModuleService from "../services/module_service.ts";

/**
 * Reads the dependency file(s) and checks if dependencies are out of date
 *     - If `dependencies` passed in, it will only  check those deps inside the dep file
 *     - If `dependencies` is empty, checks all
 *
 * @param dependencies - A list of dependencies (module names) to check
 */
export async function check(dependencies: string[]): Promise<void> {
  // Create objects for each dep, with its name and version
  const modules = await ModuleService.constructModulesDataFromDeps(
    dependencies,
    "check",
  );

  if (modules === false || typeof modules === "boolean") {
    LoggerService.logError("Modules specified do not exist in your dependencies.");
    Deno.exit(1);
  }

  // Compare imported and latest version
  LoggerService.logInfo("Comparing versions...");
  let depsCanBeUpdated: boolean = false;
  const listOfModuleNamesToBeUpdated: string[] = [];
  modules.forEach((module) => {
    if (module.importedVersion !== module.latestRelease) {
      depsCanBeUpdated = true;
      listOfModuleNamesToBeUpdated.push(module.name);
      LoggerService.logInfo(
          module.name + " can be updated from " + module.importedVersion +
            " to " + module.latestRelease,
      );
    }
  });
  // Logging purposes
  if (depsCanBeUpdated) {
    LoggerService.logInfo(
      "To update, run: \n    dmm update " +
        listOfModuleNamesToBeUpdated.join(" "),
    );
  } else {
    LoggerService.logInfo("Your dependencies are up to date");
  }
}
