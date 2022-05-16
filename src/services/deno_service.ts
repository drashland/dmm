type ModuleMeta = {
  // deno-lint-ignore camelcase
  upload_options: {
    repository: string; // eg "drashland/drash"
    type: string; // eg "github"
  };
};

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

  public static async getThirdPartyRepoURL(
    importedModuleName: string,
  ): Promise<string> {
    const meta = await DenoService.getModuleMeta(importedModuleName);
    const repoURL =
      `https://${meta.upload_options.type}.com/${meta.upload_options.repository}`;
    return repoURL;
  }

  private static async getModuleMeta(moduleName: string): Promise<ModuleMeta> {
    const latestRelease = await DenoService.getLatestModuleRelease(
      moduleName,
    );
    const res = await fetch(
      DenoService.DENO_CDN_URL + moduleName + "/versions/" +
        latestRelease + "/meta/meta.json",
    );
    // there's more data but we only care about the stuff below
    const json: ModuleMeta = await res.json();
    return json;
  }
}
