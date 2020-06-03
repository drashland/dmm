# **D**eno **M**odule **M**anager

[![Build Status](https://travis-ci.com/ebebbington/dmm.svg?branch=master)](https://travis-ci.com/ebebbington/dmm)

`dmm` (pronounced "Dim") is a Deno module manager. Updating your dependencies within `deps.ts` and checking if new versions are available hasn't been easier.

`ddm` will read your imported/exported modules that sit inside your `deps.ts` and check them against their latest version if you ask it to, and update them if you want it to.

* Deno version: 1.0.4
* Deno std version: 0.55.0

# Features

* Zero dependencies
* Easy and simple to use
* Checks dependencies for newer versions
* Will update your dependencies for you
* Gives information on modules
* Accounts for 3rd party and `std` modules
* No installations required
* Will be kept up to date and maintained consistently

# How to Use

## `deps.ts` Structure

Your `deps.ts` file must follow Deno's best practices and coding standards. This includes import statements using double-quotes, and 3rd party modules using a `mod.ts` as the entry point to their module.

Here's an example of how your `deps.ts` file would look like:

```
import something from "https://deno.land/x/dmm@v0.1.0/mod.ts";

import something from "https://deno.land/std@0.54.0/http/mod.ts";

export * as colors from "https://deno.land/std@0.54.0/fmt/colors.ts";
```

## Help

```
$ cd /path/to/your/project
$ deno run https://deno.land/x/dmm@v1.0.1/mod.ts --help
```

## Check

Checks the given module(s), or all modules in your `deps.ts`

```
// All
$ deno run --allow-net --allow-read https://deno.land/x/dmm@v1.0.1/mod.ts check
// One
$ deno run --allow-net --allow-read https://deno.land/x/dmm@v1.0.1/mod.ts check fs
// Many
$ deno run --allow-net --allow-read https://deno.land/x/dmm@v1.0.1/mod.ts check fs http
```

## Update

Updates the given module(s), or all modules in your `deps.ts`

```
// All
$ deno run --allow-net --allow-read --allow-write https://deno.land/x/dmm@v1.0.1/mod.ts update
// One
$ deno run --allow-net --allow-read --allow-write https://deno.land/x/dmm@v1.0.1/mod.ts update fs
// Many
$ deno run --allow-net --allow-read --allow-write https://deno.land/x/dmm@v1.0.1/mod.ts update fs http
```

## Info

Provides information about a given module

```
$ deno run --allow-net https://deno.land/x/dmm@v1.0.1/mod.ts info http
```
