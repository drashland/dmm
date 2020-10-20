import { colours, commandIs, logError } from "./deps.ts";
import { helpMessage } from "./src/commands/help.ts";
import { versionMessage } from "./src/commands/version.ts";
import { info } from "./src/commands/info.ts";
import { check } from "./src/commands/check.ts";
import { update } from "./src/commands/update.ts";

const args = Deno.args.filter((arg, i) => {
  return i !== 0;
});

switch (true) {
  case commandIs("info"):
    await info(args);
    break;
  case commandIs("check"):
    await check(args);
    break;
  case commandIs("update"):
    await update(args);
    break;
  case commandIs("version"):
    console.log(versionMessage);
    break;
  case commandIs("help"):
    console.log(helpMessage);
    break;
  case commandIs("--help"):
    console.log(helpMessage);
    break;
  case commandIs("--version"):
    console.log(versionMessage);
    break;
  default:
    logError("Invalid arguments");
    console.log(helpMessage);
}
Deno.exit();
