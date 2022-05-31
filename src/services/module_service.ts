import IModule from "../interfaces/module.ts";
import { ConsoleLogger } from "../../deps.ts";
import DenoService from "../services/deno_service.ts";
import NestService from "../services/nest_service.ts";
import GitHubService from "../services/github_service.ts";
import UnpkgService from "./unpkg_service.ts";

const supportedUrls = [
  "https://deno.land",
  "https://x.nest.land",
  "https://raw.githubusercontent.com",
  "https://unpkg.com",
];
const getImportedVersion = (line: string): string => {
  if (!line.match(/@v?/) && !line.includes("/v")) {
    return "";
  }
  line = line.split("@")[1] ?? "v" + line.split("/v")[1];
  const version = line.split("/")[0];
  return version;
};

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
   * @param depsContent - The raw text content of the dependency file.
   *
   * @returns An array of objects, with each object containing information about each module
   */
  public static async constructModulesDataFromDeps(
    depsContent: string,
  ): Promise<IModule[]> {
    // Solely read the users `deps.ts` file
    ConsoleLogger.info("Gathering information on your dependencies...");

    // Only select lines we support eg versioning and an actual import line
    const listOfDeps: string[] = depsContent.split("\n").filter((line) => {
      const version = getImportedVersion(line);
      const usesVersioning = version !== "";
      let hasSupportedUrl = false;
      supportedUrls.forEach((supportedUrl) => {
        if (line.indexOf(supportedUrl) > -1) {
          hasSupportedUrl = true;
        }
      });
      const supported = hasSupportedUrl && usesVersioning === true;
      return supported;
    });

    // Collate data for each module imported
    const allModules: Array<IModule> = [];
    for (const dep of listOfDeps) {
      if (dep.indexOf("https://x.nest.land/") > -1) {
        const data = await ModuleService.constructDataForNestImport(dep);
        allModules.push(data);
      }

      if (dep.indexOf("https://deno.land/") > -1) {
        const data = await ModuleService.constructDataForDenoImport(dep);
        allModules.push(data);
      }

      if (dep.indexOf("https://raw.githubusercontent.com") > -1) {
        const data = await ModuleService.constructDataForGithubImport(dep);
        allModules.push(data);
      }

      if (dep.includes("https://unpkg.com")) {
        const data = await ModuleService.constructDataForUnpkgImport(dep);
        allModules.push(data);
      }
    }

    return allModules;
  }

  private static async constructDataForUnpkgImport(
    importLine: string,
  ): Promise<IModule> {
    const importUrl: string = importLine.substring(
      importLine.indexOf("https://"),
      importLine.lastIndexOf('"'),
    );
    const importedVersion = getImportedVersion(importLine);
    const name = importLine.match(/unpkg.com\/(.+?)@/)![1];
    const latestRelease = ModuleService.standardiseVersion(
      importedVersion,
      await UnpkgService.getLatestModuleRelease(importUrl),
    );
    return {
      latestRelease,
      name,
      std: false,
      importedVersion,
      importUrl,
    };
  }

  private static async constructDataForGithubImport(
    importLine: string,
  ): Promise<IModule> {
    const isStd = false;
    const importUrl: string = importLine.substring(
      importLine.indexOf("https://"),
      importLine.indexOf(".ts") + 3, // to include the `.ts`
    );
    const importedVersion = getImportedVersion(importLine);
    const repoNameVersionAndFile =
      importLine.split("https://raw.githubusercontent.com/")[1];
    const name = repoNameVersionAndFile.split("/")[1];
    const repositoryUrl =
      importUrl.replace("raw.githubusercontent", "github").split("/v")[0];
    const latestRelease = ModuleService.standardiseVersion(
      importedVersion,
      await GitHubService.getLatestModuleRelease(repositoryUrl),
    );
    return {
      latestRelease,
      name,
      std: isStd,
      importedVersion,
      importUrl,
    };
  }

  private static async constructDataForNestImport(
    importLine: string,
  ): Promise<IModule> {
    const isStd = importLine.indexOf("/std") > -1;
    const importUrl: string = importLine.substring(
      importLine.indexOf("https://"),
      importLine.indexOf(".ts") + 3, // to include the `.ts`
    );
    const importedVersion = getImportedVersion(importLine);
    let name = "";
    if (isStd) {
      const nameAndFile = importLine.split("@" + importedVersion + "/")[1];
      name = nameAndFile.split("/")[0];
    } else {
      const nameAndVersionAndFile = importLine.split("https://x.nest.land/")[1];
      name = nameAndVersionAndFile.split("@")[0];
    }
    const latestRelease = ModuleService.standardiseVersion(
      importedVersion,
      await NestService.getLatestModuleRelease(name),
    );
    return {
      latestRelease,
      name,
      std: isStd,
      importedVersion,
      importUrl,
    };
  }

  private static async constructDataForDenoImport(
    importLine: string,
  ): Promise<IModule> {
    const isStd = importLine.indexOf("/std") > -1;
    const importUrl: string = importLine.substring(
      importLine.indexOf("https://"),
      importLine.indexOf(".ts") + 3, // to include the `.ts`
    );
    const importedVersion = getImportedVersion(importLine);
    let name = "";
    if (isStd) {
      const nameAndFile = importLine.split("@" + importedVersion + "/")[1];
      name = nameAndFile.split("/")[0];
    } else {
      const nameAndVersionAndFile = importLine.split("https://deno.land/x/")[1];
      name = nameAndVersionAndFile.split("@")[0];
    }
    // Get the latest release - make sure the string is the same format as imported version eg using a "v"
    const latestRelease = ModuleService.standardiseVersion(
      importedVersion,
      await DenoService.getLatestModuleRelease(isStd ? "std" : name),
    );
    return {
      latestRelease,
      name,
      std: isStd,
      importedVersion,
      importUrl,
    };
  }
}
