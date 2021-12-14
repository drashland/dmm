import { Line } from "./deps.ts";
import { version } from "./src/commands/version.ts";
import { UpdateSubcommand } from "./src/commands/update.ts";

class Dmm extends Line.MainCommand {
  public signature = "dmm";

  public subcommands = [
    UpdateSubcommand,
  ];
}

const cli = new Line.CLI({
  name: "Deno Module Manager",
  description: "Lightweight Deno module manager",
  version: `v${version}`,
  command: Dmm,
});

cli.run();
