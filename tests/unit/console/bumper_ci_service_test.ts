import { assertEquals } from "../../../deps.ts";
import {
  denoVersionFiles,
  moduleVersionFiles,
} from "../../../console/bumper_ci_service_files.ts";
import { BumperService } from "../../../deps.ts";

// Not for pre-release
const b = new BumperService("dmm", Deno.args);

// For pre-release
const c = new BumperService("dmm", ["--version=1.2.3"]);

const latestVersions = await b.getLatestVersions();
const latestVersionDrash = await c.getModulesLatestVersion("drash");

Deno.test({
  name: "Bumper CI Service | bumps std versions in deps files correctly",
  async fn(): Promise<void> {
    const file = denoVersionFiles[0];
    file.filename = "./tests/data/pattern_types.txt";
    const bumped = await b.bump([file], false);
    assertEquals(bumped[0], data_depsStd);
  },
});

Deno.test({
  name: "Bumper CI Service | bumps drash versions in deps files correctly",
  async fn(): Promise<void> {
    const file = denoVersionFiles[1];
    file.filename = "./tests/data/pattern_types.txt";
    const bumped = await b.bump([file], false);
    assertEquals(bumped[0], data_depsDrash);
  },
});

Deno.test({
  name: "Bumper CI Service | bumps deno versions in yml files correctly",
  async fn(): Promise<void> {
    const file = denoVersionFiles[2];
    file.filename = "./tests/data/pattern_types.txt";
    const bumped = await b.bump([file], false);
    assertEquals(bumped[0], data_denoVersionsYml);
  },
});

Deno.test({
  name: "Bumper CI Service | bumps eggs.json correctly",
  async fn(): Promise<void> {
    const file = moduleVersionFiles[0];
    file.filename = "./tests/data/pattern_types.txt";
    const bumped = await c.bump([file], false);
    assertEquals(bumped[0], data_eggJson);
  },
});

Deno.test({
  name: "Bumper CI Service | bumps const statements correctly",
  async fn(): Promise<void> {
    const file = moduleVersionFiles[2];
    file.filename = "./tests/data/pattern_types.txt";
    const bumped = await c.bump([file], false);
    assertEquals(bumped[0], data_constStatements);
  },
});

////////////////////////////////////////////////////////////////////////////////
// DATA PROVIDERS //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const data_depsStd = `workflow files

deno: ["0.0.0"]
deno: ["0.0.0"]

-----

urls

https://deno.land/x/dmm@v0.0.0/mod.ts
https://deno.land/x/dmm@v0.0.0/mod.ts

----

consts

export const version = "0.0.0";
export const version = "0.0.0";

----

egg.json

"version": "0.0.0",

----

deps files

import { Drash } from "https://deno.land/x/drash@v0.0.0/mod.ts"; // up to date
import * as fs from "https://deno.land/std@${latestVersions.deno_std}/fs/mod.ts"; // up to date
import * as colors from "https://deno.land/std@${latestVersions.deno_std}/fmt/colors.ts"; // up to date
export { v4 } from "https://deno.land/std@${latestVersions.deno_std}/uuid/mod.ts"; // up to date
`;

const data_depsDrash = `workflow files

deno: ["0.0.0"]
deno: ["0.0.0"]

-----

urls

https://deno.land/x/dmm@v0.0.0/mod.ts
https://deno.land/x/dmm@v0.0.0/mod.ts

----

consts

export const version = "0.0.0";
export const version = "0.0.0";

----

egg.json

"version": "0.0.0",

----

deps files

import { Drash } from "https://deno.land/x/drash@v${latestVersionDrash}/mod.ts"; // up to date
import * as fs from "https://deno.land/std@0.0.0/fs/mod.ts"; // up to date
import * as colors from "https://deno.land/std@0.0.0/fmt/colors.ts"; // up to date
export { v4 } from "https://deno.land/std@0.0.0/uuid/mod.ts"; // up to date
`;

const data_denoVersionsYml = `workflow files

deno: ["${latestVersions.deno}"]
deno: ["${latestVersions.deno}"]

-----

urls

https://deno.land/x/dmm@v0.0.0/mod.ts
https://deno.land/x/dmm@v0.0.0/mod.ts

----

consts

export const version = "0.0.0";
export const version = "0.0.0";

----

egg.json

"version": "0.0.0",

----

deps files

import { Drash } from "https://deno.land/x/drash@v0.0.0/mod.ts"; // up to date
import * as fs from "https://deno.land/std@0.0.0/fs/mod.ts"; // up to date
import * as colors from "https://deno.land/std@0.0.0/fmt/colors.ts"; // up to date
export { v4 } from "https://deno.land/std@0.0.0/uuid/mod.ts"; // up to date
`;

const data_constStatements = `workflow files

deno: ["0.0.0"]
deno: ["0.0.0"]

-----

urls

https://deno.land/x/dmm@v0.0.0/mod.ts
https://deno.land/x/dmm@v0.0.0/mod.ts

----

consts

export const version = "1.2.3";
export const version = "1.2.3";

----

egg.json

"version": "0.0.0",

----

deps files

import { Drash } from "https://deno.land/x/drash@v0.0.0/mod.ts"; // up to date
import * as fs from "https://deno.land/std@0.0.0/fs/mod.ts"; // up to date
import * as colors from "https://deno.land/std@0.0.0/fmt/colors.ts"; // up to date
export { v4 } from "https://deno.land/std@0.0.0/uuid/mod.ts"; // up to date
`;

const data_eggJson = `workflow files

deno: ["0.0.0"]
deno: ["0.0.0"]

-----

urls

https://deno.land/x/dmm@v0.0.0/mod.ts
https://deno.land/x/dmm@v0.0.0/mod.ts

----

consts

export const version = "0.0.0";
export const version = "0.0.0";

----

egg.json

"version": "1.2.3",

----

deps files

import { Drash } from "https://deno.land/x/drash@v0.0.0/mod.ts"; // up to date
import * as fs from "https://deno.land/std@0.0.0/fs/mod.ts"; // up to date
import * as colors from "https://deno.land/std@0.0.0/fmt/colors.ts"; // up to date
export { v4 } from "https://deno.land/std@0.0.0/uuid/mod.ts"; // up to date
`;
