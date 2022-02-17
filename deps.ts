export { BumperService } from "https://raw.githubusercontent.com/drashland/services/v0.2.4/ci/bumper_service.ts";
export * as Line from "https://deno.land/x/line@v1.0.0/mod.ts";
import { ConsoleLogger } from "https://deno.land/x/unilogger@v1.0.4/mod.ts";
const consoleLogger = new ConsoleLogger({});
export { consoleLogger as ConsoleLogger };
export { assertEquals } from "https://deno.land/std@0.126.0/testing/asserts.ts";
export * as colours from "https://deno.land/std@0.126.0/fmt/colors.ts";
