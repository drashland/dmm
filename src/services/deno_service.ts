export default class DenoService {
  /**
   * Url for Deno's CDN link
   */
  public static readonly DENO_CDN_URL: string = "https://cdn.deno.land/";

  /**
   * Url for Deno's API link
   */
  public static readonly DENO_API_URL: string = "https://api.deno.land/";

  /**
   * Fetches the latest release of a module using deno.land cdn. Includes std as well.
   *
   * @param name - Module name
   *
   * @returns The latest version.
   */
  public static async getLatestModuleRelease(
    name: string,
  ): Promise<string> {
    const res = await fetch(
      DenoService.DENO_CDN_URL + name + "/meta/versions.json",
    );
    const json: { latest: string; versions: string[] } = await res.json();
    const latestRelease = json.latest;
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
      DenoService.DENO_API_URL + "modules?query={module:" + importedModuleName +
        "}&limit=1",
    );
    const json: {
      success: boolean;
      data: {
        total_count: number;
        results: Array<{
          name: string;
          description: string;
          star_count: number;
          search_score: number;
        }>;
      };
    } = await res.json();
    const description = json.data.results[0].description;
    return description;
  }

  /**
   * Fetches the owner and repository name, for the given module
   *
   *     await getThirdPartyRepoAndOwner("drash"); // "drashland/deno-drash"
   *
   * @param importedModuleName - The imported module in which we want to get the repository for on github
   *
   * @returns The owner and repo name, eg "<owner>/<repo>"
   */
  public static async getThirdPartyRepoAndOwner(
    importedModuleName: string,
  ): Promise<string> {
    const latestRelease = await DenoService.getLatestModuleRelease(
      importedModuleName,
    );
    const res = await fetch(
      DenoService.DENO_CDN_URL + importedModuleName + "/versions/" +
        latestRelease + "/meta/meta.json",
    );
    const json: {
      upload_options: {
        repository: string;
      };
    } = await res.json();
    const repository = json.upload_options.repository;
    return repository;
  }

  public static async getThirdPartyRepoURL(importedModuleName: string,): Promise<string> {
    const repoAndOwner = await DenoService.getThirdPartyRepoAndOwner(importedModuleName);
    return "https://github.com/" + repoAndOwner;
  }
}
