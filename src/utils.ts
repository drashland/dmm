export function standardiseVersion (importedVersion: string, latestVersion: string): string {
  const importedVersionHasV = importedVersion.indexOf("v") === 0;
  const latestVersionHasV = latestVersion.indexOf("v") === 0;

  if (importedVersionHasV && !latestVersionHasV) {
    latestVersion = "v" + latestVersion;
    return latestVersion
  }

  if (!importedVersionHasV && latestVersionHasV) {
    latestVersion = latestVersion.substring(1);
    return latestVersion
  }
}

interface DenoLandDatabase {
  [key: string]: {
    name: string;
    repo: string;
    desc: string;
    owner: string
  }
}
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
export const denoLandDatabase: DenoLandDatabase = await getDenoLandDatabase();

/**
 * @description
 * Fetches the latest std version
 *
 * @returns {Promise<string>} eg "0.57.0"
 */
export async function getLatestStdRelease(): Promise<string> {
  const res = await fetch(
      "https://raw.githubusercontent.com/denoland/deno_website2/master/deno_std_versions.json",
  );
  const versions: string[] = await res.json();
  let latestVersion = versions[0];
  return latestVersion;
}

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
export async function getLatestThirdPartyRelease(name: string): Promise<string> {
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