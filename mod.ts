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
const options: string[] = args.filter(arg => arg.indexOf('--') >= 0)
const wantsHelp: boolean = options.filter(option => option === '--help').length === 1
if (!wantsHelp) console.info('Gathering facts...')
const purpose: string = args[0];
const modulesForPurpose: string[] = (args.slice(1)).filter(arg => arg.indexOf('--') === -1)

// Arguments must be passed in
if (!args.length) {
    console.error(colours.red('Invalid arguments. See --help'))
    Deno.exit(1)
}

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

// Create objects for each dep, with its name and version
let modules: Module[] = getModulesFromDepsFile(modulesForPurpose, purpose)

// Get database.json so we can get the github url for the module name
console.info('Fetching GitHub urls...')
modules = await addGitHubUrlForModules(modules)

// Get the latest version for each module
console.info('Fetching the latest versions...')
modules = await addLatestReleaseForModules(modules)

// Run the desired purpose
purposes[purpose](modules)
Deno.exit()