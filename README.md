# **D**eno **M**odule **M**anager

`dmm` (pronounced "Dim") is a Deno module manager. Updating your dependencies within `deps.ts` and checking if new versions are available hasn't been easier.

`ddm` will read your imported/exported modules that sit inside your `deps.ts` and check them against their latest version if you ask it to, and update them if you want it to.

* Deno version: 1.0.3
* Deno std version: 0.54.0

# Features

* Zero dependencies
* Easy and simple to use
* Checks dependencies for newer versions
* Will update your dependencies for you
* Accounts for 3rd party and `std` modules
* No installations required
* Will be kept up to date and maintained consistently

# How to Use

## `deps.ts` Structure

Your `deps.ts` file must follow Deno's best practices and coding standards. This includes import statements using double-quotes, and 3rd party modules using a `mod.ts` as the entry point to their module.

Here is an example of the structure your `deps.ts` file would follow:

```
import something from "https://deno.land/x/[module]@[version]/mod.ts";

import something from "https://deno.land/std@[version]/[module]/[file].ts";

export * as colors from "https://deno.land/std@[version]/fmt/colors.ts";
```

Here's an example of how your `deps.ts` file would look like:

```
import something from "https://deno.land/x/dmm@v0.1.0/mod.ts"; // or "@0.1.0"

import something from "https://deno.land/std@0.54.0/http/mod.ts";

export * as colors from "https://deno.land/std@0.54.0/fmt/colors.ts";
```

## Run

```
$ cd /path/to/your/project
$ deno run https://github.com/ebebbington/dmm/mod.ts --help
$ deno run --allow-net --allow-read https://github.com/ebebbington/dmm/mod.ts check
$ deno run --allow-net --allow-read https://github.com/ebebbington/dmm/mod.ts check fs
$ deno run --allow-net --allow-read https://github.com/ebebbington/dmm/mod.ts check fs http
$ deno run --allow-net --allow-read --allow-write https://github.com/ebebbington/dmm/mod.ts update
$ deno run --allow-net --allow-read --allow-write https://github.com/ebebbington/dmm/mod.ts update fs
$ deno run --allow-net --allow-read --allow-write https://github.com/ebebbington/dmm/mod.ts update fs http
$ deno run --allow-net --allow-read --allow-write https://github.com/ebebbington/dmm/mod.ts update
```
