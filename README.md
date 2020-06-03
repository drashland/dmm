# **D**eno **M**odule **M**anager

[![Build Status](https://travis-ci.com/ebebbington/dmm.svg?branch=master)](https://travis-ci.com/ebebbington/dmm)

**This module was developed with avoiding certain NPM features in mind, such as: installating the manager or packages and extra files required (no `package.json` and `node_modules`)**

`dmm` (pronounced "Dim") is a Deno module manager. Updating your dependencies within `deps.ts` and checking if new versions are available hasn't been easier.

`ddm` will read your imported/exported modules that sit inside your `deps.ts` and check them against their latest version if you ask it to, and update them if you want it to.

* Deno version: 1.0.4
* Deno std version: 0.55.0

# Contents

* [Features](#features)
* [How To Use](#how-to-use)
    * [Help](#help)
    * [Check](#check)
    * [Update](#update)
    * [Info](#info)

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

This module reads your `deps.ts` to determine the dependencies you use and will collate them all with extra information into a list of objects. If you pass in certain modules for your purpose, such as `dmm check fs http`, dmm will only pull tose modules.

* It doesn't matter if you are exporting or importing a module from deno.land
    ```typescript
    // dmm will check this
    import { red } from "https://deno.land/std@0.55.0/fmt/colors.ts";
    // dmm will check this
    export { red } from "https://deno.land/std@0.55.0/fmt/colors.ts";
  
    ```

dmm will only read modules that reside on [deno.land](https://deno.land), whether they are 3rd party or `std` modules. Take the below as an example:
```typescript
export { red } from ""
```

Whether it's checking, updating, or getting info on a module, dmm will grab the 

# Commands

There are two ways you can use this module: installing it though `deno`, or running it though a URL.

*Install*
```
$ deno install dmm
$ dmm <permissions> ...
```

*Through the URL*

If you are using this method, be sure to use the latest version of dmm in the command below
```
$ deno run <permissions> https://deno.land/x/dmm@v1.0.1/mod.ts ...
```

In the examples below, dmm is installed and we will be using it that way to make the commands easier to read.

## Your `deps.ts` File

dmm will read the import/export lines of a module 

Your `deps.ts` file must follow Deno's best practices and coding standards. This includes import URL statements using double-quotes, and 3rd party modules using a `mod.ts` as the entry point to their module.

Here's an example of how your `deps.ts` file would look like:

```
import something from "https://deno.land/x/dmm@v0.1.0/mod.ts";

import something from "https://deno.land/std@0.54.0/http/mod.ts";

export * as colors from "https://deno.land/std@0.54.0/fmt/colors.ts";
```

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
