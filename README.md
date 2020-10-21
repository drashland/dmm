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

* [Documentation](#documentation)
* [Features](#features)
* [Quick Start](#quick-start)
* [How it Works](#how-it-works)
* [Mirrors](#mirrors)
* [Contributing](#contributing)
* [License](#license)

# Documentation

[Full Documentation](https://drash.land/dmm/)

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
$ dmm help
```

*Through the URL*

```
$ deno run --allow-net='cdn.deno.land,api.deno.land' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v1.1.5/mod.ts help
```

In the examples below, dmm is installed and we will be using it that way to make the commands easier to read.

# How it Works

* dmm reads the `deps.ts` file at the current working directory. It will check for versioned imports/exports and check or update against each one

* dmm currently only supports the deno.land registry (https://deno.land)

* For updating, dmm will fetch the latest version/release for each dependency and update your `deps.ts` if it is newer than the one you use
dmm will only read modules that reside on [deno.land](https://deno.land), whether they are 3rd party or `std` modules. As long as you are either importing then exporting a module, or only exporting a module, dmm will check that dependency.

## Mirrors

* https://nest.land/package/dmm

## Contributing

Contributors are welcomed!

Please read through our [contributing guidelines](./.github/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

## License
By contributing your code, you agree to license your contribution under the [MIT License](./LICENSE).
