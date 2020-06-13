import { colours } from "../../deps.ts";
import {denoLandDatabase, latestStdRelease, getLatestThirdPartyRelease} from "../utils.ts";

export async function info (modules: string[]) {
  if (modules.length === 0 || modules.length > 1) {
    console.error(
        colours.red(
            "Specify a single module to get information on. See --help",
        ),
    );
    Deno.exit(1);
  }
  const moduleToGetInfoOn = modules[0];
  const stdResponse = await fetch(
      "https://github.com/denoland/deno/tree/master/std/" + moduleToGetInfoOn,
  );
  const isStd = stdResponse.status === 200;
  const isThirdParty = typeof denoLandDatabase[moduleToGetInfoOn] === "object";
  if (!isStd && !isThirdParty) {
    console.error(
        colours.red("No module was found with " + moduleToGetInfoOn),
    );
    Deno.exit(1);
  }
  const name = moduleToGetInfoOn;
  let description;
  let denoLandUrl;
  let gitHubUrl;
  let latestVersion;
  if (isStd) {
    latestVersion = latestStdRelease;
    description = "Cannot retrieve descriptions for std modules";
    denoLandUrl = "https://deno.land/std@" + latestVersion + "/" +
        name;
    gitHubUrl = "https://github.com/denoland/deno/tree/master/std/" + name;
  }
  if (isThirdParty) {
    const databaseModule = denoLandDatabase[moduleToGetInfoOn];
    description = databaseModule.desc;
    gitHubUrl = "https://github.com/" + databaseModule.owner + "/" +
        databaseModule.repo;
    latestVersion = await getLatestThirdPartyRelease(name);
    denoLandUrl = "https://deno.land/x/" + name + "@" + latestVersion;
  }
  const importLine = "import * as " + name + ' from "' + denoLandUrl + '";';
  console.info(
      "\n" +
      `Information on ${name}\n\n  - Name: ${name}\n  - Description: ${description}\n  - deno.land Link: ${denoLandUrl}\n  - GitHub Repository: ${gitHubUrl}\n  - Import Statement: ${importLine}\n  - Latest Version: ${latestVersion}` +
      "\n",
  );
  Deno.exit();
}