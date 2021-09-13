import { Line } from "./deps.ts";
import { version } from "./src/commands/version.ts";
import { UpdateSubcommand } from "./src/commands/update.ts";
import { InfoSubcommand } from "./src/commands/info.ts";
import { CheckSubcommand } from "./src/commands/check.ts";

const c = new Line({
  command: "dmm",
  name: "Deno Module Manager",
  description: "Lightweight Deno module manager",
  version: `v${version}`,
  subcommands: [
    UpdateSubcommand,
    InfoSubcommand,
    CheckSubcommand,
  ],
});

c.run();
