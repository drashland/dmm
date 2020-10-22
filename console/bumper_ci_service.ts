import { BumperService } from "https://raw.githubusercontent.com/drashland/services/master/ci/bumper_service.ts";
import { denoVersionFiles, moduleVersionFiles } "./bumper_ci_service_files.ts";

const b = new BumperService("dmm", Deno.args);

if (b.isForPreRelease()) {
  b.bump(moduleVersionFiles);
} else {
  b.bump(denoVersionFiles);
  Deno.copyFileSync(
    "./tests/integration/up-to-date-deps/original_deps.ts",
    "./tests/integration/up-to-date-deps/deps.ts",
  );
}
