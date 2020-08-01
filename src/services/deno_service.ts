interface DenoLandDatabase {
  [key: string]: {
    name: string;
    repo: string;
    desc: string;
    owner: string;
  };
}

/**
 * @description
 * Fetches the latest std version
 *
 * @returns {Promise<string>} eg "0.57.0"
 */
async function getLatestStdRelease(): Promise<string> {
  const res = await fetch(
    "https://raw.githubusercontent.com/denoland/deno_website2/master/versions.json",
  );
  const versions: {
    std: string[];
    cli_to_std: { [key: string]: string };
  } = await res.json(); // { std: ["0.63.0", ...], cli_to_std: { v1.2.2: "0.63.0", ... } }
  const latestVersion = versions.std[0];
  return latestVersion;
}

const latestStdRelease = await getLatestStdRelease();

/**
 * @description
 * Fetches Deno's `database.json` from the `deno_website2` GitHub repo
 *
 * @return {Promise<[key: string]: DenoLandDatabaseModule>} All 3rd party modules in Deno's registry
 */
async function getDenoLandDatabase(): Promise<DenoLandDatabase> {
  const res = await fetch(
    "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json",
  );
  const denoDatabase: DenoLandDatabase = await res.json();
  return denoDatabase;
}

const denoLandDatabase: DenoLandDatabase = await getDenoLandDatabase();

export default class DenoService {
  /**
   * @description
   * Fetches the latest release of a module from it's GitHub repository.
   * Achieves this by reading Deno's `database.json` to get the repository name
   * and owner then sending a fetch request.
   *
   * @param {string} name Module name
   *
   * @returns {Promise<string>} The latest version.
   */
  public static async getLatestThirdPartyRelease(
    name: string,
  ): Promise<string> {
    const owner = denoLandDatabase[name].owner;
    const repo = denoLandDatabase[name].repo;
    const res = await fetch(
      "https://github.com/" + owner + "/" + repo + "/releases/latest",
    );
    const url = res.url;
    const urlSplit = url.split("/");
    let latestRelease = urlSplit[urlSplit.length - 1];
    return latestRelease;
  }

  /**
   * @description
   * Get the latest std release version
   *
   * @returns {string} eg "0.57.0"
   */
  public static getLatestStdRelease(): string {
    return latestStdRelease;
  }

  /**
   * @description
   * Get JSON file of 3rd party modules on deno.land
   *
   * @returns {DenoLandDatabase}
   */
  public static getDenoLandDatabase(): DenoLandDatabase {
    return denoLandDatabase;
  }
}
