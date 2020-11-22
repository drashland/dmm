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

`dmm` is a Deno module manager. It can update your `deps.ts` file, check if any of your dependencies are out of date, and give you information about any module in the Deno world. Managing your dependencies hasn't been easier.

# Table of Contents

* [Documentation](#documentation)
* [Features](#features)
* [Quick Start](#quick-start)
* [How it Works](#how-it-works)
* [Mirrors](#mirrors)
* [Contributing](#contributing)
* [License](#license)

# Documentation

* [Full Documentation](https://drash.land/dmm/)

# Features

* Zero dependencies
* Easy and simple to use
* Checks dependencies for newer versions
* Will update your dependencies for you
* Gives information on modules
* Accounts for 3rd party and Deno Standard modules
* Installation is optional
* No variants of `node_modules` and `package.json`
* No extra configuration around import maps

# Quick Start

Get started [here](https://drash.land/dmm/#/#quickstart) with a basic example.

# How It Works

dmm reads the `deps.ts` file at the current working directory -- checking versioned `import` and `export` statements and checking to see if they can be updated. If any dependency can be updated, it lets you know which ones can be updated; and if you want to update them, dmm will rewrite your `deps.ts` file so that your dependencies reflect their latest versions.

_Note: nest.land may not reflect the latest Deno Standard Modules version immediately after Deno releases a new version. Please keep this in mind when importing your modules via nest.land._

## Mirrors

* https://nest.land/package/dmm

## Contributing

Contributors are welcomed!

Please read through our [contributing guidelines](./.github/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

## License

By contributing your code, you agree to license your contribution under the [MIT License](./LICENSE).
