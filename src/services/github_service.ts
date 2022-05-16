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

  /**
   * Fetches the description for a repo
   *
   *     await getThirdPartyDescription("drash"); // "A REST microframework ..."
   *
   * @param repository
   * @param name
   *
   * @returns The description
   */
  public static async getThirdPartyDescription(
    repository: string,
    name: string,
  ): Promise<string> {
    const res = await fetch(
      "https://api.github.com/repos/" + repository + "/" + name,
    );
    const json = await res.json();
    const description = json.description;
    return description;
  }
}
