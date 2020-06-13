async function getLatestStdVersion () {
  const res = await fetch(
      "https://raw.githubusercontent.com/denoland/deno_website2/master/deno_std_versions.json",
  );
  const versions = await res.json();
  const latestVersion = versions[0];
  return latestVersion;
}

export const latestStdVersion = await getLatestStdVersion()