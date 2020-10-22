import { CliService } from "./deps.ts";
import { helpMessage } from "./src/commands/help.ts";
import { versionMessage } from "./src/commands/version.ts";
import { info } from "./src/commands/info.ts";
import { check } from "./src/commands/check.ts";
import { update } from "./src/commands/update.ts";

const c = new CliService(Deno.args);

c.addSubcommand(["help", "--help"], async () => {
  console.log(helpMessage);
});

c.addSubcommand(["version", "--version"], () => {
  console.log(versionMessage);
});

c.addSubcommand("info", async (args: string[]) => {
  await info(args);
}, { requires_args: true });

c.addSubcommand("update", async (args: string[]) => {
  await update(args);
}, { requires_args: true });

c.addSubcommand("check", async (args: string[]) => {
  await check(args);
}, { requires_args: true });

c.run();
