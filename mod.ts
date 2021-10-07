import { Line } from "./deps.ts";
import { version } from "./src/commands/version.ts";
import { UpdateSubcommand } from "./src/commands/update.ts";

const c = new Line({
  command: "dmm",
  name: "Deno Module Manager",
  description: "Lightweight Deno module manager",
  version: `v${version}`,
  subcommands: [
    UpdateSubcommand,
  ],
});

c.run();
