import ModuleService from "../services/module_service.ts";

import { ConsoleLogger, Subcommand } from "../../deps.ts";

export class CheckSubcommand extends Subcommand {
  public signature = "check [...modules]";
  public description =
    "Check if the given dependencies you hold are outdated. Will check all if modules are omitted. Ex: dmm info; dmm info drash fs";

  public async handle() {
    const dependencies = Deno.args.filter((arg) => arg.indexOf("check") === -1);
    // Create objects for each dep, with its name and version
    const allModules = await ModuleService.constructModulesDataFromDeps(
      "deps.ts",
    );
    const selectedModules = allModules.filter((module) => {
      if (dependencies.length) { // only return selected modules of selecting is set
        return dependencies.indexOf(module.name) > -1;
      } else {
        return true;
      }
    });

    if (selectedModules.length === 0) {
      ConsoleLogger.error(
        "Modules specified do not exist in your dependencies.",
      );
      Deno.exit(1);
    }

    // Compare imported and latest version
    ConsoleLogger.info("Comparing versions...");
    let depsCanBeUpdated = false;
    const listOfModuleNamesToBeUpdated: string[] = [];
    selectedModules.forEach((module) => {
      if (module.importedVersion !== module.latestRelease) {
        depsCanBeUpdated = true;
        listOfModuleNamesToBeUpdated.push(module.name);
        ConsoleLogger.info(
          module.name + " can be updated from " + module.importedVersion +
            " to " + module.latestRelease,
        );
      }
    });
    // Logging purposes
    if (depsCanBeUpdated) {
      ConsoleLogger.info(
        "To update, run: \n    dmm update " +
          listOfModuleNamesToBeUpdated.join(" "),
      );
    } else {
      ConsoleLogger.info("Your dependencies are up to date");
    }
  }
}
