import { BumperService } from "https://raw.githubusercontent.com/drashland/services/master/ci/bumper_service.ts";

const b = new BumperService("dmm", Deno.args);

if (b.isForPreRelease()) {
  // Update files across the filesystem
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
  ]);
  Deno.copyFileSync(
    "./tests/integration/up-to-date-deps/original_deps.ts",
    "./tests/integration/up-to-date-deps/deps.ts",
  );
}
