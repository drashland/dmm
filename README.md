# **D**eno **M**odule **M**anager

[![Build Status](https://travis-ci.com/ebebbington/dmm.svg?branch=master)](https://travis-ci.com/ebebbington/dmm)

`dmm` (pronounced "Dim") is a Deno module manager. Updating your dependencies within `deps.ts` and checking if new versions are available hasn't been easier.

`dmm` will read your imported/exported modules that sit inside your `deps.ts` and check them against their latest version if you ask it to, and update them if you want it to.

* Deno version: 1.0.4
* Deno std version: 0.55.0

# Contents

* [Features](#features)
* [How it Worka](#how-it-works)
* [How to Run](#how-to-run)
* [Commands](#commands)
    * [Help](#help)
    * [Check](#check)
    * [Update](#update)
    * [Info](#info)
* [Example](#example)

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

# How it Works

dmm will only read modules that reside on [deno.land](https://deno.land), whether they are 3rd party or `std` modules. As long as you are either importing then exporting a module, or only exporting a module, dmm will check that dependency.

* Your dependencies must be versioned. Not versioning your dependencies is bad practice and can lead to many problems in your project, which is why dmm will not support it. For example:
    ```
    import { red } from "https://deno.land/std@0.55.0/fmt/colors.ts";
                                              ^^^^^^^
    ```

* dmm only supports importing/exporting modules from Deno's registry: [deno.land](https://deno.land), 3rd party or `std`. For example:
    ```
    import { red } from "https://deno.land/std@0.55.0/fmt/colors.ts"; // supported
    import { something } from "https://deno.land/x/something@0v1.0.0/mod.ts"; // supported
    ```

* dmm will read your `deps.ts` and convert the dependencies into objects.

* dmm will then retrieve the rest of the required information for later use for each module:
    * Latest version - for 3rd party modules, it's taken from the GitHub API. For `std` modules, it's taken from `https://deno.land/std/@<latest version>/version.ts`
    * GitHub URL - Retrieved through the GitHub API
    
* After this, dmm run different actions based on the purpose:

    * **check**
    
        Will compare the version you are using of a module with the latest one
        
    * **update**
        
        If the latest version is more recent than the one you use for a given module, dmm will update the version in your `deps.ts` file
        
    * **info**
    
        Displays information about the given module using information collated at the start of the script

# How to Run

There are two ways you can use this module: installing it though `deno`, or running it though a URL.

*Install*
```
$ deno install --allow-net --allow-read --allow-write dmm
$ dmm ...
```

*Through the URL*

If you are using this method, be sure to use the latest version of dmm in the command below
```
$ deno run <permissions> https://deno.land/x/dmm@v1.0.1/mod.ts ...
```

In the examples below, dmm is installed and we will be using it that way to make the commands easier to read.

# Commands

## Help

Provides information on how to use dmm

```
$ dmm --help
```

## Check

Checks every dependency in your project, 3rd party or not, that you use to check if there is a newer version available. If you only want to check certain dependencies then you can pass those in.

The modules you specify must exist in your `deps.ts`, if they don't then dmm will silently exit.

```
// All of your dependencies in `deps.ts`
$ dmm check
// Only check the `fs` module
$ dmm check fs
// Only check the `fs` and `http` and `denon` modules
$ dmm check fs http denon
```

## Update

Updates all dependencies in your project, 3rd party or not, but only if the module isn't using the latest version. If you only want to update dependencies then you can pass those in.

```
// All of your dependencies in `deps.ts`
$ dmm update
// Only update the fs module if there is a newer version than what you current have
$ dmm update fs
// Only update the `fs` and `http` and `denon` modules if newer versions have been released
$ dmm update fs http denon
```

## Info

Provides information about a given module. The module must sit on [deno.land](https://deno.land), regardless of whether it is an `std` or 3rd party module.

The module given does not need to be inside your `deps.ts` file

```
$ dmm info http
```

# Example

In this example, we are going to run through every step of dmm. We will be checking dependencies, updating them, and getting information about certain ones.


