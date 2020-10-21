import { BumperService } from "https://raw.githubusercontent.com/drashland/services/master/ci/bumper_service.ts";

const b = new BumperService("dmm", Deno.args);

if (b.isForPreRelease()) {
  b.bump([
    {
      filename: "./egg.json",
      replaceTheRegex: /"version": "[0-9\.]+[0-9\.]+[0-9\.]"/,
      replaceWith: `"version": "{{ version }}"`,
    },
    {
      filename: "./README.md",
      replaceTheRegex: /dmm@v[0-9\.]+[0-9\.]+[0-9\.]/g,
      replaceWith: `dmm@v{{ version }}`,
    },
    {
      filename: "./src/commands/version.ts",
      replaceTheRegex: /version = "[0-9\.]+[0-9\.]+[0-9\.]"/,
      replaceWith: `version = "{{ version }}"`,
    },
  ]);
} else {
  b.bump([
    {
      filename: "./tests/integration/up-to-date-deps/original_deps.ts",
      replaceTheRegex: /std@[0-9.]+[0-9.]+[0-9]/g,
      replaceWith: "std@{{ latestStdVersion }}",
    },
    {
      filename: "./tests/integration/up-to-date-deps/original_deps.ts",
      replaceTheRegex: /drash@v[0-9.]+[0-9.]+[0-9]/g,
      replaceWith: "drash@v{{ latestDrashVersion }}",
    },
    {
      filename: "./.github/workflows/master.yml",
      replaceTheRegex: /deno: ["[0-9.]+[0-9.]+[0-9]"]/g,
      replaceWith: `deno: ["{{ latestDenoVersion }}"]`,
    },
    {
      filename: "./.github/workflows/bumper.yml",
      replaceTheRegex: /deno: ["[0-9.]+[0-9.]+[0-9]"]/g,
      replaceWith: `deno: ["{{ latestDenoVersion }}"]`,
    },
    {
      filename: "./.github/workflows/pre_release.yml",
      replaceTheRegex: /deno: ["[0-9.]+[0-9.]+[0-9]"]/g,
      replaceWith: `deno: ["{{ latestDenoVersion }}"]`,
    },
  ]);
  Deno.copyFileSync(
    "./tests/integration/up-to-date-deps/original_deps.ts",
    "./tests/integration/up-to-date-deps/deps.ts",
  );
}
