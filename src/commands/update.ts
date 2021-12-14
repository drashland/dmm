import { ConsoleLogger, Line } from "../../deps.ts";
import ModuleService from "../services/module_service.ts";

export class UpdateSubcommand extends Line.Subcommand {
  public signature = "update [deps_location]";
  public description =
    "Update all dependencies in the `deps.ts` file in your CWD, or specify a location to a dependency file.";
  public arguments = {
    "deps_location": "Path to your dependency file. Optional.",
  };

  public async handle() {
    const depsLocation = this.argument("deps_location") ?? "deps.ts";
    // Line doesnt allow us to get a n number of args whereby they can be optional
    // Create objects for each dep, with its name and version
    const modules = await ModuleService.constructModulesDataFromDeps(
      depsLocation,
    );
    if (modules.length === 0) {
      ConsoleLogger.error(
        "Modules specified do not exist in your dependencies.",
      );
      Deno.exit(1);
    }

    // Check for updates and rewrite `deps.ts` if needed
    ConsoleLogger.info("Checking if your modules can be updated...");
    const usersWorkingDir: string = Deno.realPathSync(".");
    let depsWereUpdated = false;
    let depsContent: string = new TextDecoder().decode(
      Deno.readFileSync(usersWorkingDir + "/" + depsLocation),
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
        let newImportUrl = module.importUrl;
        newImportUrl = newImportUrl.replace(
          module.importedVersion,
          module.latestRelease,
        );
        depsContent = depsContent.replace(module.importUrl, newImportUrl);
      }
      ConsoleLogger.info(
        module.name + " was updated from " + module.importedVersion + " to " +
          module.latestRelease,
      );
      depsWereUpdated = true;
    });

    // Re-write the file
    Deno.writeFileSync(
      usersWorkingDir + "/" + depsLocation,
      new TextEncoder().encode(depsContent),
    );

    // And if none were updated, add some more logging
    if (!depsWereUpdated) {
      ConsoleLogger.info("Everything is already up to date");
    }
  }
}
