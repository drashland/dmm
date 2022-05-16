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
    const json = await res.json() as {
      latestVersion: string;
    };
    const latestReleaseWithName = json.latestVersion;
    const latestRelease = latestReleaseWithName.substr(
      latestReleaseWithName.indexOf("@") + 1,
    );
    return latestRelease;
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
    const json = await res.json() as {
      repository: string;
    };
    const repositoryUrl = json.repository;
    return repositoryUrl;
  }
}
