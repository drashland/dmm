import { BumperService } from "https://raw.githubusercontent.com/drashland/services/master/ci/bumper_service.ts";
import { preReleaseFiles } from "./bumper_ci_service_files.ts";

const b = new BumperService("dmm", Deno.args);

if (b.isForPreRelease()) {
  b.bump(preReleaseFiles);
}

// As dmm was used to update the deps, coy the file over so we dont need to include this in bumper files
Deno.copyFileSync(
  "./tests/integration/up-to-date-deps/deps.ts",
  "./tests/integration/up-to-date-deps/original_deps.ts",
);
