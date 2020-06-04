import {
    helpMessage,
    getModulesFromDepsFile,
    Module,
    addGitHubUrlForModules,
    addLatestReleaseForModules,
    purposes
} from "./dmm.ts";
import { denoStdLatestVersion, colours } from "./deps.ts"

// Gather facts
const args: string[] = Deno.args;
if (!args.length) {
    console.error(colours.red('Invalid arguments. See --help'))
    Deno.exit(1)
}
const wantsHelp: boolean = args.filter(arg => arg === '--help').length === 1
if (!wantsHelp) console.info('Gathering facts...')
// const purpose: string = args[0];
// const modulesForPurpose: string[] = (args.slice(1)).filter(arg => arg.indexOf('--') === -1)
const purposeAndModules = args.filter(arg => arg.indexOf('--') === -1)
const purpose: string = purposeAndModules[0]
const modulesForPurpose: string[] = purposeAndModules.slice(1)

// Support --help usage
if (wantsHelp) {
    console.info(helpMessage)
    Deno.exit()
}

// Error when a supported purpose isn't found
// Must be after the help logic because --help isn't really a supported purpose
if (typeof purposes[purpose] !== 'function') {
    console.error(colours.red('Specify either `check` or `update`. See --help'))
    Deno.exit(1)
}

// Run the desired purpose
await purposes[purpose](modulesForPurpose, purpose)
Deno.exit()