<p align="center">
  <img height="200" src="logo.png" alt="Deno Module Manager">
  <h1 align="center">Deno Module Manager</h1>
</p>
<p align="center">
  <a href="https://github.com/drashland/dmm/releases">
    <img src="https://img.shields.io/github/release/drashland/dmm.svg?color=bright_green&label=latest">
  </a>
  <a href="https://github.com/drashland/dmm/actions">
    <img src="https://img.shields.io/github/workflow/status/drashland/dmm/master?label=ci">
  </a>
  <a href="https://discord.gg/SgejNXq">
    <img src="https://img.shields.io/badge/chat-on%20discord-blue">
  </a>
  <a href="https://rb.gy/5ppdbh">
    <img src="https://img.shields.io/badge/Tutorials-YouTube-red">
  </a>
</p>

---

`dmm` (pronounced "Dim") is a Deno module manager. Updating your dependencies within `deps.ts` and checking if new versions are available hasn't been easier.

`dmm` will read your imported/exported modules that sit inside your `deps.ts` and check them against their latest version if you ask it to, and update them if you want it to.

# Contents

* [Features](#features)
* [Quick Start](#quick-start)
* [Example](#example)
* [How it Works](#how-it-works)
* [Contributing](#contributing)
* [License](#license)

# Features

* Zero dependencies
* Easy and simple to use
* Checks dependencies for newer versions
* Will update your dependencies for you
* Gives information on modules
* Accounts for 3rd party and `std` modules
* Installation is optional
* Will be kept up to date and maintained consistently
* No variants of `node_modules` and `package.json`
* No extra configuration around import maps

# Quick Start

There are two ways you can use this module: installing it though `deno`, or running it though a URL.

As dmm only needs to read and write to your `deps.ts`, as well as requiring network access using Deno's CDN and API, you can restrict the access this module has.

*Install*
```
$ deno install --allow-net='cdn.deno.land,api.deno.land' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v1.1.5/mod.ts
$ dmm ...
```

*Through the URL*

If you are using this method, be sure to use the latest version of dmm in the command below
```
$ deno run --allow-net='cdn.deno.land,api.deno.land' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v1.1.5/mod.ts ...
```

In the examples below, dmm is installed and we will be using it that way to make the commands easier to read.
        
# Example

In this example, we are going to run through every step of dmm. We will be checking dependencies, updating them, and getting information about certain ones.

**Step 1 - Info**

Say I want to get information about the fmt module:

```
$ dmm info fmt

Information on fmt

  - Name: fmt
  - Description: Cannot retrieve descriptions for std modules
  - deno.land Link: https://deno.land/std@0.76.0/fmt
  - GitHub Repository: https://github.com/denoland/deno/tree/master/std/fmt
  - Import Statement: import * as fmt from "https://deno.land/std@0.76.0/fmt";
  - Latest Version: 0.76.0

```

**Step 2 - Adding `fmt` as a dependency to use `colors`**

Along with my current dependencies, I decided to import the `colors` sub-module of `fmt` in my `deps.ts` file:

```typescript
export { Drash } from "https://deno.land/x/drash@v1.0.0/mod.ts"; // out of date

import * as fs from "https://deno.land/std@0.53.0/fs/mod.ts"; // out of date

import * as colors from "https://deno.land/std@0.76.0/fmt/colors.ts"; // up to date

export { fs, colors }
```

Take notice of the out of date dependencies.

**Step 3 - Check**

Now we want to check if any of our dependencies need updating, but we don't want to update them yet.

```
$ dmm check
...
drash can be updated from v1.0.0 to v1.2.5
fs can be updated from 0.53.0 to 0.76.0
...
```

**Step 4 - Update**

Lets update our dependencies as some are out of date:

```
$ dmm update
...
drash was updated from v1.0.0 to v1.2.5
fs was updated from 0.53.0 to 0.76.0
...
```

Now lets check the `deps.ts` file, and you will notice the versions have been modified:

```typescript
export { Drash } from "https://deno.land/x/drash@v1.2.5/mod.ts"; // was out of date

import * as fs from "https://deno.land/std@0.76.0/fs/mod.ts"; // was out of date

import * as colors from "https://deno.land/std@0.76.0/fmt/colors.ts";

export { fs, colors }
```

**Step 5 - Help**

Should you need any more information, use the `--help` option:

```
$ dmm --help

A module manager for Deno.    

USAGE:
    deno run --allow-read --allow-net [--allow-write] https://deno.land/x/dmm@v1.1.5/mod.ts [ARGS] [MODULES]

    dmm [ARGS] [MODULES]

ARGUMENTS:
The check and update arguments cannot be used together.

    check
        Checks the specified modules for newer version. Will check all if modules are omitted.

    update
        Updates the specified modules to the newest version. Will update all if modules are omitted.

     info
        Shows information about the given module, be it std or 3rd party. The 3rd party module must be referenced at https://deno.land/x/

OPTIONS:
    --help
        Prints help message
    --version
        Prints dmm version

EXAMPLE USAGE:
    Assume you are importing an out of date version of `fs` from `std`. See [here](#quick-start) for adding further restrictions.
    deno run --allow-net --allow-read https://deno.land/x/dmm@v1.1.5/mod.ts check fs
    deno run --allow-net --allow-read --allow-write https://deno.land/x/dmm@v1.1.5/mod.ts update fs
    deno run --allow-net https://deno.land/x/dmm@v1.1.5/mod.ts info http
    dmm info http

```

# How it Works

dmm will only read modules that reside on [deno.land](https://deno.land), whether they are 3rd party or `std` modules. As long as you are either importing then exporting a module, or only exporting a module, dmm will check that dependency.

* Your dependencies must be versioned. Not versioning your dependencies is bad practice and can lead to many problems in your project, which is why dmm will not support it. For example:
    ```
    import { red } from "https://deno.land/std@0.56.0/fmt/colors.ts";
                                              ^^^^^^^
    ```

* dmm only supports importing/exporting modules from Deno's registry: [deno.land](https://deno.land), 3rd party or `std`. For example:
    ```
    import { red } from "https://deno.land/std@0.56.0/fmt/colors.ts"; // supported
    import { something } from "https://deno.land/x/something@0v1.0.0/mod.ts"; // supported
    ```

* dmm will read every `from "https://deno.land/..."` line in your `deps.ts` and using the name and version, will convert the dependencies into objects.

* dmm will then retrieve the rest of the required information for later use for each module:
    * Latest version - For std and 3rd party, this is pulled using `https://cdn.deno.land`.
    * GitHub URL - Retrieved through the GitHub API
    * Description - For 3rd party modules, it is taken from `https://api.deno.land`. There is currently no way to get descriptions for std modules.
    
* After this, dmm will run different actions based on the purpose:

    * **check**
    
        Will compare the version you are using of a module with the latest one
        
    * **update**
        
        If the latest version is more recent than the one you use for a given module, dmm will update the version in your `deps.ts` file
        
    * **info**
    
        Displays information about the given module using information collated at the start of the script
        
## Contributing

Contributors are welcomed!

Please read through our [contributing guidelines](./.github/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

## License
By contributing your code, you agree to license your contribution under the [MIT License](./LICENSE).
