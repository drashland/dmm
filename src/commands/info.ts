import { LoggerService } from "../../deps.ts";
import DenoService from "../services/deno_service.ts";

/**
 * Supplies information on the given module in the first
 * index of `modules`
 *
 * @param modules - List of modules to get info on. Currently, we only support 1, so `modules[0]` will be used
 */
export async function info(modules: string[]): Promise<void> {
  const moduleToGetInfoOn = modules[0];
  const stdResponse = await fetch(
    "https://github.com/denoland/deno/tree/master/std/" + moduleToGetInfoOn,
  );
  const thirdPartyResponse = await fetch(
    DenoService.DENO_CDN_URL + moduleToGetInfoOn + "/meta/versions.json",
  ); // Only used so we can check if the module exists
  const isStd = stdResponse.status === 200;
  const isThirdParty = thirdPartyResponse.status === 200;
  if (!isStd && !isThirdParty) {
    LoggerService.logError("No module was found with " + moduleToGetInfoOn);
    Deno.exit(1);
  }
  const name = moduleToGetInfoOn;
  let description;
  let denoLandUrl;
  let gitHubUrl;
  let latestVersion;
  if (isStd) {
    latestVersion = await DenoService.getLatestModuleRelease("std");
    description = "Cannot retrieve descriptions for std modules";
    denoLandUrl = "https://deno.land/std@" + latestVersion + "/" +
      name;
    gitHubUrl = "https://github.com/denoland/deno/tree/master/std/" + name;
  }
  if (isThirdParty) {
    description = await DenoService.getThirdPartyDescription(name);
    gitHubUrl = "https://github.com/" +
      await DenoService.getThirdPartyRepoAndOwner(name);
    latestVersion = await DenoService.getLatestModuleRelease(name);
    denoLandUrl = "https://deno.land/x/" + name + "@" + latestVersion;
  }
  const importLine = "import * as " + name + ' from "' + denoLandUrl + '";';
  LoggerService.logInfo(
      `Information on ${name}\n\n  - Name: ${name}\n  - Description: ${description}\n  - deno.land Link: ${denoLandUrl}\n  - GitHub Repository: ${gitHubUrl}\n  - Import Statement: ${importLine}\n  - Latest Version: ${latestVersion}` +
      "\n",
  );
  Deno.exit();
}
