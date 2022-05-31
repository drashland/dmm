export default class UnkpgService {
  /**
   * Fetches the latest release of a github repository
   *
   * @param importUrl - Url of the package on unpkg, eg https://unpkg.com/table-layout@2.0.0/dist/index.mjs
   *
   * @returns The latest version.
   */
  public static async getLatestModuleRelease(
    importUrl: string,
  ): Promise<string> {
    const url = importUrl.replace(/@.+?\//, "/");
    const res = await fetch(url);
    await res.arrayBuffer();
    const match = res.url.match(/@(.+?)\//);
    if (!match || match.length === 1) {
      return "";
    }
    return match[1];
  }
}
