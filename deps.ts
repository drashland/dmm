export { BumperService } from "https://raw.githubusercontent.com/drashland/services/v0.2.5/ci/bumper_service.ts";
export * as Line from "https://deno.land/x/line@v1.0.1/mod.ts";
import { ConsoleLogger } from "https://deno.land/x/unilogger@v1.0.4/mod.ts";
const consoleLogger = new ConsoleLogger({});
export { consoleLogger as ConsoleLogger };
export { assertEquals } from "https://deno.land/std@0.140.0/testing/asserts.ts";
export * as colours from "https://deno.land/std@0.140.0/fmt/colors.ts";
