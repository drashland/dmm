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

const version = "v1.0.2"

export async function checkDmmVersion () {
    const res = await fetch("https://github.com/ebebbington/dmm/releases/latest");
    const splitUrl: string[] = res.url.split('/');
    const latestVersion: string = splitUrl[splitUrl.length - 1];
    if (version !== latestVersion) {
        console.warn(colours.yellow('dmm is currently outdated. Please update to the latest version of ' + latestVersion))
    }
}

export const helpMessage: string = "\n" +
    "A module manager for Deno." +
    "\n" +
    "\n" +
    "USAGE:" +
    "\n" +
    "    deno run --allow-read --allow-net [--allow-write] https://deno.land/x/dmm@v1.0.1/mod.ts [ARGS] [MODULES]" +
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
    "     info" +
    "\n" +
    "        Shows information about the given module." +
    "\n" +
    "\n" +
    "EXAMPLE USAGE:" +
    "\n" +
    "    Assume you are importing an out of date version of `fs` from `std`." +
    "\n" +
    "    deno run --allow-net --allow-read https://deno.land/x/dmm@v1.0.0/mod.ts check fs" +
    "\n" +
    "    deno run --allow-net --allow-read --allow-write https://deno.land/x/dmm@v1.0.0/mod.ts update fs" +
    "\n" +
    "    deno run --allow-net https://deno.land/x/dmm@v1.0.0/mod.ts info http"
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
 * @returns {Module[]|boolean} The modules we need to check or update
 */
export function getModulesFromDepsFile (modulesForPurpose: string[], purpose: string): Module[]|false {
    // Get file content and covert each line into an item in an array
    console.info('Reading deps.ts...')
    const usersWorkingDir: string = "."
    const depsContent: string = decoder.decode(Deno.readFileSync(usersWorkingDir + "/deps.ts")); // no need for a try/catch. The user needs a deps.ts file
    let modules: Array<Module> = []
    let listOfDeps: string[] = depsContent.split('\n')
    listOfDeps = listOfDeps.filter(dep => dep !== "") // strip empty lines
    // Collate data for each module imported
    listOfDeps.forEach(dep => {
        // ignore lines that aren't importing from somewhere
        const importUsesDoubleQuotes: boolean = dep.indexOf("from \"https://deno.land") >= 0
        const importUsesSingleQuotes: boolean = dep.indexOf("from \'https://deno.land") >= 0
        if (importUsesDoubleQuotes === false && importUsesSingleQuotes === false) {
            return
        }
        // Grab data
        const std: boolean = dep.indexOf("https://deno.land/std") >= 0
        const url: string = importUsesDoubleQuotes === true
            ? dep.substring(
                dep.lastIndexOf("from \"") + 6,
                dep.lastIndexOf("\"")
            )
            : dep.substring(
                dep.lastIndexOf("from \'") + 6,
                dep.lastIndexOf("\'")
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
    if (!modules.length) {
        return false
    }
    return modules
}

async function getDenoLandDatabase (): Promise<any> {
    const res = await fetch("https://raw.githubusercontent.com/denoland/deno_website2/master/database.json")
    const denoDatabase = await res.json()
    return denoDatabase
}

/**
 * @description
 * Grabs deno's database.json file and checks all the module names against their git repository
 *
 * @param {Module[]} modules
 *
 * @return {Module[]} The same passed in parameter but with a new `repo` property
 */
export async function addGitHubUrlForModules (modules: Module[]): Promise<Module[]> {
    console.info('Fetching GitHub urls...')
    const denoDatabase = await getDenoLandDatabase()
    modules.forEach(module => {
        if (module.std === false) {
            // 3rd party
            module.repo = "https://github.com/" + denoDatabase[module.name].owner + "/" + denoDatabase[module.name].repo
        } else {
            // std
            module.repo = "https://github.com/denoland/deno/std/" + module.name
        }
    })
    return modules
}

/**
 * @description
 * Appends the latest releast for each module using their repo url
 *
 * @param {Module[]} modules
 *
 * @returns {Promise<Module[]>}
 */
export async function addLatestReleaseForModules (modules: Module[]): Promise<Module[]> {
    console.info('Fetching the latest versions...')
    for (const module of modules) {
        // if 3rd party, go to the github repo
        if (module.std === false) {
            const res = await fetch(module.repo + "/releases/latest");
            const splitUrl: string[] = res.url.split('/');
            const latestVersion: string = splitUrl[splitUrl.length - 1];
            module.latestRelease = latestVersion;
        } else {
            // when std, get it from somewhere else
            module.latestRelease = denoStdLatestVersion
        }
    }
    return modules
}

/**
 * Main logic for purposes of this module.
 */
export const purposes: { [key: string]: Function } = {
    'check': async function (modulesForPurpose: string[], purpose: string) {
        // Create objects for each dep, with its name and version
        let modules = getModulesFromDepsFile(modulesForPurpose, purpose)
        if (modules === false) {
            console.error(colours.red('Modules specified do not exist in your dependencies.'))
            Deno.exit(1)
            return
        }
        // Get database.json so we can get the github url for the module name
        modules = await addGitHubUrlForModules(modules)
        // Get the latest version for each module
        modules = await addLatestReleaseForModules(modules)
        console.info('Comparing versions...')
        let depsCanBeUpdated: boolean = false
        let listOfModuleNamesToBeUpdated: string[] = []
        modules.forEach(module => {
            if (module.version !== module.latestRelease) {
                depsCanBeUpdated = true
                listOfModuleNamesToBeUpdated.push(module.name)
                console.info(colours.yellow(module.name + ' can be updated from ' + module.version + ' to ' + module.latestRelease))
            }
        })
        // Logging purposes
        if (depsCanBeUpdated) {
            console.info('To update, run: \n    deno run --allow-net --allow-read --allow-write https://github.com/ebebbington/dmm/mod.ts update ' + listOfModuleNamesToBeUpdated.join(" "))
        } else {
            console.info(colours.green('Your dependencies are up to date'))
        }
    },
    'update': async function (modulesForPurpose: string[], purpose: string) {
        // Create objects for each dep, with its name and version
        let modules = getModulesFromDepsFile(modulesForPurpose, purpose)
        if (modules === false) {
            console.error(colours.red('Modules specified do not exist in your dependencies.'))
            Deno.exit(1)
            return
        }
        // Get database.json so we can get the github url for the module name
        modules = await addGitHubUrlForModules(modules)
        // Get the latest version for each module
        modules = await addLatestReleaseForModules(modules)
        console.info('Updating...')
        // Read deps.ts and update the string
        const usersWorkingDir: string = "."
        let depsContent: string = decoder.decode(Deno.readFileSync(usersWorkingDir + "/deps.ts")); // no need for a try/catch. The user needs a deps.ts file
        modules.forEach(module => {
            if (module.std === true) {
                // only re-write modules that need to be updated
                if (module.version === denoStdLatestVersion) {
                    return
                }
                depsContent = depsContent.replace("std@" + module.version + '/' + module.name, 'std@' + denoStdLatestVersion + "/" + module.name)
                module.updated = true
            } else {
                // only re-write modules that need to be updated
                if (module.version === module.latestRelease) {
                    return
                }
                depsContent = depsContent.replace(module.name + "@" + module.version, module.name + "@" + module.latestRelease)
                module.updated = true
            }
        })
        // Re-write the file
        Deno.writeFileSync(usersWorkingDir + "/deps.ts", new TextEncoder().encode(depsContent))
        // Below is just for logging
        modules.forEach(module => {
            if (module.std === true && module.updated === true) {
                console.info(colours.green(module.name + ' was updated from ' + module.version + ' to ' + denoStdLatestVersion))
            } else if (module.std === false && module.updated === true) {
                console.info(colours.green(module.name + ' was updated from ' + module.version + ' to ' + module.latestRelease))
            }
        })
        // And if none were updated, add some more logging
        const depsWereUpdated: boolean = (modules.filter(module => module.updated === true)).length >= 1
        if (!depsWereUpdated) {
            console.info(colours.green('Everything is already up to date'))
        }
    },
    'info': async function (modulesForPurpose: string[], purpose: string) {
        const moduleToGetInfoOn = modulesForPurpose.length ? modulesForPurpose[0] : ''
        if (moduleToGetInfoOn === '' || modulesForPurpose.length > 1) {
            console.error(colours.red('Invalid arguments. Specify one module to get information on.'))
            Deno.exit(1)
        }
        const database = await getDenoLandDatabase()
        const stdResponse = await fetch("https://github.com/denoland/deno/tree/master/std/" + moduleToGetInfoOn)
        const isStd = stdResponse.status === 200
        const isThirdParty = typeof database[moduleToGetInfoOn] === 'object'
        if (!isStd && !isThirdParty) {
            console.error(colours.red('No module was found with ' + moduleToGetInfoOn))
            Deno.exit(1)
        }
        const name = moduleToGetInfoOn;
        let description;
        let denoLandUrl;
        let gitHubUrl;
        let latestVersion;
        if (isStd) {
            latestVersion = denoStdLatestVersion
            description = "Cannot retrieve descriptions for std modules"
            denoLandUrl = "https://deno.land/std@" + denoStdLatestVersion + "/" + name
            gitHubUrl = "https://github.com/denoland/deno/tree/master/std/" + name
        }
        if (isThirdParty) {
            const databaseModule = database[moduleToGetInfoOn]
            description = databaseModule.desc
            gitHubUrl = "https://github.com/" + databaseModule.owner + "/" + databaseModule.repo
            const res = await fetch(gitHubUrl + "/releases/latest");
            const splitUrl: string[] = res.url.split('/');
            latestVersion = splitUrl[splitUrl.length - 1];
            denoLandUrl = "https://deno.land/x/" + name + "@" + latestVersion
        }
        const importLine = "import * as " + name + " from \"" + denoLandUrl + "\";"
        console.info(colours.yellow(`\nInformation on ${name}\n\n  - Name: ${name}\n  - Description: ${description}\n  - deno.land Link: ${denoLandUrl}\n  - GitHub Repository: ${gitHubUrl}\n  - Import Statement: ${importLine}\n  - Latest Version: ${latestVersion}\n`))
        Deno.exit()
    }
}
