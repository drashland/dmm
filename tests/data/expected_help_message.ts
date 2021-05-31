import { version } from "../../src/commands/version.ts";

export const expectedHelpMessage =
  `Deno Module Manager - Lightweight Deno module manager

USAGE

    dmm [option | [[subcommand] [args] [deno flags] [options]]]

OPTIONS

    -h, --help    Show this menu.
    -v, --version Show this CLI's version.

SUBCOMMANDS

    update
        Update all dependencies in the \`deps.ts\` file in your CWD, or specify certain modules to update or a location to a dependency file.
    info
        Get information about any number of given dependencies.
    check
        Check if the given dependencies you hold are outdated. Will check all if modules are omitted. Ex: dmm info; dmm info drash fs

`;
