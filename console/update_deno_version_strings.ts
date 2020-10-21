import { bumper } from "https://raw.githubusercontent.com/drashland/services/master/console/bumper.ts";

bumper([
  {
    filename: "./.github/workflows/master.yml",
    replaceTheRegex: /deno: ["[0-9.]+[0-9.]+[0-9]"]/g,
    replaceWith: `deno: ["{{ latestDenoVersion }}"]`
  },
  {
    filename: "./.github/workflows/bumper.yml",
    replaceTheRegex: /deno: ["[0-9.]+[0-9.]+[0-9]"]/g,
    replaceWith: `deno: ["{{ latestDenoVersion }}"]`
  },
  {
    filename: "./tests/integration/up-to-date-deps/original_deps.ts",
    replaceTheRegex: /std@[0-9.]+[0-9.]+[0-9]/g,
    replaceWith: "std@{{ latestStdVersion }}"
  },
  {
    filename: "./tests/integration/up-to-date-deps/original_deps.ts",
    replaceTheRegex: /drash@v[0-9.]+[0-9.]+[0-9]/g,
    replaceWith: "drash@v{{ latestDrashVersion }}"
  }
])

//Deno.copyFileSync("./tests/integration/up-to-date-deps/original_deps.ts", "./tests/integration/up-to-date-deps/deps.ts")