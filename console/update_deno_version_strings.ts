// Overview
//
// Updates deno version strings in files.
// This scripts main purpose is to aid the `bumper`,
// removing any extra manual work when we bump the deno version

let fileContent = "";
const decoder = new TextDecoder();
const encoder = new TextEncoder();
let fetchRes = await fetch("https://cdn.deno.land/deno/meta/versions.json");
let versions: {
  latest: string;
  versions: string[];
} = await fetchRes.json(); // eg { latest: "v1.3.3", versions: ["v1.3.2", ...] }
const latestDenoVersion = versions.latest.replace("v", "");
fetchRes = await fetch("https://cdn.deno.land/std/meta/versions.json");
versions = await fetchRes.json();
const latestStdVersion = versions.latest.replace("v", ""); // replacing because std doesn't allow `v` in imports, so it's never seen anymore
fetchRes = await fetch("https://cdn.deno.land/drash/meta/versions.json");
versions = await fetchRes.json();
const latestDrashVersion = versions.latest;

// Master workflow
fileContent = decoder.decode(
  await Deno.readFile("./.github/workflows/master.yml"),
);
fileContent = fileContent.replace(
  /deno: ["[0-9.]+[0-9.]+[0-9]"]/g,
  `deno: ["${latestDenoVersion}"]`,
);
await Deno.writeFile(
  "./.github/workflows/master.yml",
  encoder.encode(fileContent),
);

// Bumper workflow
fileContent = decoder.decode(
  await Deno.readFile("./.github/workflows/bumper.yml"),
);
fileContent = fileContent.replace(
  /deno: ["[0-9.]+[0-9.]+[0-9]"]/g,
  `deno: ["${latestDenoVersion}"]`,
);
await Deno.writeFile(
  "./.github/workflows/bumper.yml",
  encoder.encode(fileContent),
);

// Readme, all occurrences for std versions
fileContent = decoder.decode(
  await Deno.readFile("./.README.md"),
);
fileContent = fileContent.replace( // imports
  /{{ latestStdVersion }}/g,
  `${latestStdVersion}`,
);
fileContent = fileContent.replace( // "<module> was updated from <v> to <v>
  /{{ latestDrashVersion }}/g,
  `${latestDrashVersion}`,
);
await Deno.writeFile(
  "./README.md",
  encoder.encode(fileContent),
);

// up-to-date dependencies for tests
fileContent = decoder.decode(
  await Deno.readFile("./tests/integration/up-to-date-deps/original_deps.ts"),
);
fileContent = fileContent.replace( // imports
  /std@[0-9.]+[0-9.]+[0-9]/g,
  `std@${latestStdVersion}`,
);
fileContent = fileContent.replace( // imports
  /drash@v[0-9.]+[0-9.]+[0-9]/g,
  `drash@${latestDrashVersion}`,
);
await Deno.writeFile(
  "./tests/integration/up-to-date-deps/original_deps.ts",
  encoder.encode(fileContent),
);
await Deno.writeFile(
  "./tests/integration/up-to-date-deps/deps.ts",
  encoder.encode(fileContent),
);
