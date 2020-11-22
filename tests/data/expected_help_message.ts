import {version} from "../../src/commands/version.ts";

export const expectedHelpMessage = `
A module manager for Deno.

USAGE

    deno install --allow-net='x.nest.land,cdn.deno.land,api.deno.land,raw.githubusercontent.com,github.com,api.github.com' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v${version}/mod.ts
    dmm [SUBCOMMAND]

SUBCOMMANDS

    check [modules]
        Checks the specified modules for newer version. Will check all if modules are 
        omitted.

    update [modules]
        Updates the specified modules to the newest version. Will update all if modules 
        are omitted.

    info [modules]
        Displays information about the given modules, be it std or 3rd party. The 3rd 
        party module must be referenced at https://deno.land/x/

    help, --help
        Prints the help message

    version, --version
        Prints the current dmm version


EXAMPLE USAGE

    Install dmm
        deno install --allow-net='x.nest.land,cdn.deno.land,api.deno.land,raw.githubusercontent.com,github.com,api.github.com' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v${version}/mod.ts

    Check a single module
        dmm check fs

    Update a single module
        dmm update fs

    Get information about a module
        dmm info http

`