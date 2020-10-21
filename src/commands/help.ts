import { CliService } from "../../deps.ts";
import { version } from "./version.ts";

export const helpMessage = CliService.createHelpMenu({
  description: `A module manager for Deno.`,
  usage: [
    `deno install --allow-net='cdn.deno.land,api.deno.land' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v${version}/mod.ts`,
    `dmm [command]`,
  ],
  commands: {
    "check [modules]":
      "Checks the specified modules for newer version. Will check all if modules are omitted.",
    "update [modules]":
      "Updates the specified modules to the newest version. Will update all if modules are omitted.",
    "info":
      "Shows information about the given module, be it std or 3rd party. The 3rd party module must be referenced at https://deno.land/x/",
    "help, --help": "Prints the help message",
    "version, --version": "Prints the current dmm version",
  },
  example_usage: [
    {
      description: "Install dmm",
      examples: [
        `deno install --allow-net='cdn.deno.land,api.deno.land' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v${version}/mod.ts`,
      ],
    },
    {
      description: "Check a single module",
      examples: [
        `dmm check fs`,
      ],
    },
    {
      description: "Update a single module",
      examples: [
        `dmm update fs`,
      ],
    },
    {
      description: "Get information about a module",
      examples: [
        "dmm info http",
      ],
    },
  ],
});
