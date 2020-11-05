export const regexes = {
  const_statements: /version = ".+"/g,
  deps_drash: /drash@v[0-9.]+[0-9.]+[0-9]/g,
  deps_std: /std@[0-9.]+[0-9.]+[0-9]/g,
  egg_json: /"version": ".+"/,
  urls: /dmm@v[0-9\.]+[0-9\.]+[0-9\.]/g,
  yml_deno: /deno: \[".+"\]/g,
};

export const preReleaseFiles = [
  {
    filename: "./egg.json",
    replaceTheRegex: regexes.egg_json,
    replaceWith: `"version": "{{ thisModulesLatestVersion }}"`,
  },
  {
    filename: "./README.md",
    replaceTheRegex: regexes.urls,
    replaceWith: `dmm@v{{ thisModulesLatestVersion }}`,
  },
  {
    filename: "./src/commands/version.ts",
    replaceTheRegex: regexes.const_statements,
    replaceWith: `version = "{{ thisModulesLatestVersion }}"`,
  },
  {
    filename: "./tests/integration/error_test.ts",
    replaceTheRegex: regexes.urls,
    replaceWith: "dmm@v{{ thisModulesLatestVersion }}"
  },
  {
    filename: "./tests/integration/help_test.ts",
    replaceTheRegex: regexes.urls,
    replaceWith: "dmm@v{{ thisModulesLatestVersion }}"
  },
  {
    filename: "./tests/integration/info_test.ts",
    replaceTheRegex: regexes.urls,
    replaceWith: "dmm@v{{ thisModulesLatestVersion }}"
  },
  {
    filename: "./tests/integration/info_test.ts",
    replaceTheRegex: regexes.deps_drash,
    replaceWith: "drash@v{{ latestDrashVersion }}"
  }
];

export const bumperFiles = [
  {
    filename: "./tests/integration/up-to-date-deps/original_deps.ts",
    replaceTheRegex: regexes.deps_std,
    replaceWith: "std@{{ latestStdVersion }}",
  },
  // Yes... this is NOT a deno version file, but we're trying to keep the tests
  // up to date and it has a Drash version... so gtfo... leave this alone kthx.
  {
    filename: "./tests/integration/up-to-date-deps/original_deps.ts",
    replaceTheRegex: regexes.deps_drash,
    replaceWith: "drash@v{{ latestDrashVersion }}",
  },
  {
    filename: "./.github/workflows/master.yml",
    replaceTheRegex: regexes.yml_deno,
    replaceWith: `deno: ["{{ latestDenoVersion }}"]`,
  },
  {
    filename: "./.github/workflows/bumper.yml",
    replaceTheRegex: regexes.yml_deno,
    replaceWith: `deno: ["{{ latestDenoVersion }}"]`,
  },
  {
    filename: "./.github/workflows/pre_release.yml",
    replaceTheRegex: regexes.yml_deno,
    replaceWith: `deno: ["{{ latestDenoVersion }}"]`,
  },
  {
    filename: "./tests/integration/info_test.ts",
    replaceTheRegex: regexes.deps_drash,
    replaceWith: "drash@v{{ latestDrashVersion }}"
  }
];
