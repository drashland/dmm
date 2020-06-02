import { denoStdLatestVersion, colours } from "./deps.ts"

const decoder = new TextDecoder()

export interface Module {
    std: boolean;
    name: string;
    version: string,
    url: string,
    repo?: string,
    latestRelease?: string,
    updated?: boolean
}

export const helpMessage: string = "\n" +
    "A module manager for Deno." +
    "\n" +
    "\n" +
    "USAGE:" +
    "\n" +
    "    deno run --allow-read --allow-net [--allow-write] https://github.com/ebebbington/dmm/mod.ts [ARGS] [MODULES]" +
    "\n" +
    "\n" +
    "ARGUMENTS:" +
    "\n" +
    "The check and update arguments cannot be used together." +
    "\n" +
    "\n" +
    "    check" +
    "\n" +
    "        Checks the specified modules for newer version. Will check all if modules are omitted." +
    "\n" +
    "\n" +
    "    update" +
    "\n" +
    "        Updates the specified modules to the newest version. Will update all if modules are omitted." +
    "\n" +
    "\n" +
    "EXAMPLE USAGE:" +
    "\n" +
    "    Assume you are importing an out of date version of `fs` from `std`." +
    "\n" +
    "    deno run --allow-net --allow-read https://github.com/ebebbington/dmm/mod.ts check fs" +
    "\n" +
    "    deno run --allow-net --allow-read --allow-write https://github.com/ebebbington/dmm/mod.ts update fs" +
    "\n"