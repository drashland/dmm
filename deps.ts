export { BumperService } from "https://raw.githubusercontent.com/drashland/services/v0.2.1/ci/bumper_service.ts";
export { CliService } from "https://raw.githubusercontent.com/drashland/services/v0.2.1/cli/cli_service.ts";
import { ConsoleLogger } from "https://deno.land/x/unilogger@v1.0.1/mod.ts";
const consoleLogger = new ConsoleLogger({});
export { consoleLogger as ConsoleLogger };
export { assertEquals } from "https://deno.land/std@0.93.0/testing/asserts.ts";
import * as colours from "https://deno.land/std@0.93.0/fmt/colors.ts";
export { colours };
