export const regexes = {
  const_statements: /version = ".+"/g,
  deps_drash: /drash@v[0-9.]+[0-9.]+[0-9]/g,
  deps_std: /std@[0-9.]+[0-9.]+[0-9]/g,
  egg_json: /"version": ".+"/,
  urls: /dmm@v[0-9\.]+[0-9\.]+[0-9\.]/g,
  yml_deno: /deno: \[".+"\]/g,
  dmm_raw_github: /dmm\/v[0-9\.]+[0-9\.]+[0-9\.]/g,
};

export const preReleaseFiles = [
  {
    filename: "./egg.json",
    replaceTheRegex: regexes.egg_json,
    replaceWith: `"version": "{{ thisModulesLatestVersion }}"`,
  },
  {
    filename: "./src/commands/version.ts",
    replaceTheRegex: regexes.const_statements,
    replaceWith: `version = "{{ thisModulesLatestVersion }}"`,
  },
];

export const bumperFiles = [];
