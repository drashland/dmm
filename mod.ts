import { colours } from "./deps.ts";
import { helpMessage } from "./src/commands/help.ts";
import { versionMessage } from "./src/commands/version.ts";
import { info } from "./src/commands/info.ts";
import { check } from "./src/commands/check.ts";
import { update } from "./src/commands/update.ts";

async function run(
  purpose: string,
  modulesForPurpose: string[],
): Promise<void> {
  if (purpose === "check") {
    await check(modulesForPurpose);
  } else if (purpose === "info") {
    await info(modulesForPurpose);
  } else if (purpose === "update") {
    await update(modulesForPurpose);
  } else {
    console.error(
      colours.red("Specify either `check`, `info` or `update`. See --help"),
    );
    Deno.exit(1);
  }
}

// Gather args
const args: string[] = Deno.args;
if (!args.length) {
  console.error(colours.red("Invalid arguments. See --help"));
  Deno.exit(1);
}

// Support --help usage
const wantsHelp: boolean = args.filter((arg) => arg === "--help").length === 1;
if (wantsHelp) {
  console.info(helpMessage);
  Deno.exit();
}

// Support --version usage
const wantsVersion: boolean =
  args.filter((arg) => arg === "--version").length === 1;
if (wantsVersion) {
  console.info(versionMessage);
  Deno.exit();
}

// Gather facts
console.info("Gathering facts...");
const purposeAndModules: string[] = args.filter((arg) =>
  arg.indexOf("--") === -1
);
const purpose: string = purposeAndModules[0];
const modulesForPurpose: string[] = purposeAndModules.slice(1);

await run(purpose, modulesForPurpose);
