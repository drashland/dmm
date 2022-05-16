export default class GitHubService {
  /**
   * Fetches the latest release of a github repository
   *
   * @param githubUrl - Url of the github repository, eg https://github.com/drashland/dmm
   *
   * @returns The latest version.
   */
  public static async getLatestModuleRelease(
    githubUrl: string,
  ): Promise<string> {
    const res = await fetch(githubUrl + "/releases/latest");
    await res.arrayBuffer();
    const url = res.url;
    const splitUrl = url.split("/v")[1];
    const latestVersion = "v" + splitUrl;
    return latestVersion;
  }
}
