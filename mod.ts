import { colours, CommandService, logError } from "./deps.ts";
import { helpMessage } from "./src/commands/help.ts";
import { versionMessage } from "./src/commands/version.ts";
import { info } from "./src/commands/info.ts";
import { check } from "./src/commands/check.ts";
import { update } from "./src/commands/update.ts";

const args = Deno.args.slice().filter((arg: string, i: number) => {
  return i !== 0;
});

const c = new CommandService(Deno.args);

c.addCommand("--help", async () => {
  console.log(helpMessage);
});

c.addCommand("--version", () => {
  console.log(versionMessage);
});

c.addCommand("info", async () => {
  await info(args);
});

c.addCommand("help", () => {
  console.log(helpMessage);
});

c.addCommand("update", async () => {
  await update(args);
});

c.addCommand("version", () => {
  console.log(versionMessage);
});

c.addCommand("check", async () => {
  await check(args);
});

c.executeCommand();
