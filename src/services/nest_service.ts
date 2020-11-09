interface nestModule {
  name: string;
  normalizedName: string;
  owner: string;
  description: string;
  repository: string;
  latestVersion: string;
  latestStableVersion: string;
  packageUploadNames: string[];
  locked: boolean | null;
  malicious: boolean | null;
  unlisted: boolean;
  updatedAt: string;
  createdAt: string;
}

export default class NestService {
  /**
   * Url for Nest.Land's API link
   */
  public static readonly NEST_API_URL: string = "https://x.nest.land/api/";

  /**
   * Fetches the latest release of a module using nest.land cdn. Includes std as well.
   *
   * @param name - Module name
   *
   * @returns The latest version.
   */
  public static async getLatestModuleRelease(
    name: string,
  ): Promise<string> {
    const res = await fetch(NestService.NEST_API_URL + "package/" + name);
    const json: nestModule = await res.json();
    const latestReleaseWithName = json.latestVersion;
    const latestRelease = latestReleaseWithName.substr(
      latestReleaseWithName.indexOf("@") + 1,
    );
    return latestRelease;
  }

  /**
   * Fetches the description for a module
   *
   *     await getThirdPartyDescription("drash"); // "A REST microframework ..."
   *
   * @param importedModuleName - The imported module in which we want to get the description for
   *
   * @returns The description
   */
  public static async getThirdPartyDescription(
    importedModuleName: string,
  ): Promise<string> {
    const res = await fetch(
      NestService.NEST_API_URL + "package/" + importedModuleName,
    );
    const json: nestModule = await res.json();
    const description = json.description;
    return description;
  }

  /**
   * Fetches the owner and repository name, for the given module
   *
   *     await getThirdPartyRepoAndOwner("drash"); // "drashland/nest-drash"
   *
   * @param importedModuleName - The imported module in which we want to get the repository for on github
   *
   * @returns The owner and repo name, eg "<owner>/<repo>"
   */
  public static async getThirdPartyRepoURL(
    importedModuleName: string,
  ): Promise<string> {
    const res = await fetch(
      NestService.NEST_API_URL + "package/" + importedModuleName,
    );
    const json: nestModule = await res.json();
    const repositoryUrl = json.repository;
    return repositoryUrl;
  }
}
