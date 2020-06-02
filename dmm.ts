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

/**
 * @description
 * Reads the users `deps.ts` file, and all of the imports (or export { ... } from "..."), to construct
 * a list of module objects. It is dynamic to account for the different purposes eg if the user wants all,
 * many, or one module updated/checked
 *
 * @param {string[]} modulesForPurpose. A list the user only wants to check or update. Empty if they want every dep checked or updated
 * @param {string} purpose The users purpose, whether that be "check" or "update". Used for logging
 *
 * @returns {Module[]} The modules we need to check or update
 */
export function getModulesFromDepsFile (modulesForPurpose: string[], purpose: string): Module[] {
    // Get file content and covert each line into an item in an array
    console.info('Reading deps.ts...')
    const usersWorkingDir: string = Deno.cwd()
    const depsContent: string = decoder.decode(Deno.readFileSync(usersWorkingDir + "/deps.ts")); // no need for a try/catch. The user needs a deps.ts file
    let modules: Array<Module> = []
    let listOfDeps: string[] = depsContent.split('\n')
    listOfDeps = listOfDeps.filter(dep => dep !== "") // strip empty lines
    // Collate data for each module imported
    listOfDeps.forEach(dep => {
        // ignore lines that aren't importing from somewhere
        if (dep.indexOf('from \"https://deno.land/') === -1) {
            return
        }
        // Grab data
        const std: boolean = dep.indexOf("https://deno.land/std") >= 0
        const url: string = dep.substring(
            dep.lastIndexOf("from \"") + 6,
            dep.lastIndexOf("\"")
        )
        const version: string = std === true
            ? (dep.split('/std@')[1]).split('/')[0]
            : dep.substring(
                dep.lastIndexOf("@") + 1,
                dep.lastIndexOf("/mod.ts")
            )
        const name: string = std === true
            ? (dep.split('@' + version + '/')[1]).split('/')[0]
            : dep.substring(
                dep.lastIndexOf("/x/") + 3,
                dep.lastIndexOf("@")
            )

        // Only add to `modules` if user wants to check/update all or if it matches one they want to it to
        if (modulesForPurpose.length && modulesForPurpose.indexOf(name) >= 0) {
            modules.push({std, name, version, url})
            console.info('Added ' + name + " into the list to " + purpose)
        } else if (modulesForPurpose.length === 0) {
            modules.push({std, name, version, url})
            console.info('Added ' + name + " into the list to " + purpose)
        }
    })
    return modules
}