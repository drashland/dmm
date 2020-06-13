import { colours } from "../../deps";

export async function check (dependencies: string[]): Promise<any> {
  // Create objects for each dep, with its name and version
  const modules = await constructModulesDataFromDeps(
      dependencies,
      "check",
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
}