// Update a specific dep that can be updated
import { assertEquals, colours } from "../../deps.ts";
import DenoService from "../../src/services/deno_service.ts";
import NestService from "../../src/services/nest_service.ts";
import {
  outOfDateDepsDir,
  outOfDateDepsFile,
  outOfDateOriginalDepsFile,
  upToDateDepsDir,
  upToDateDepsFile,
  upToDateOriginalDepsFile,
} from "./test_constants.ts";
import GitHubService from "../../src/services/github_service.ts";

const latestDrashRelease = await DenoService.getLatestModuleRelease(
  "drash",
);
const latestCliffyRelease = await NestService.getLatestModuleRelease(
  "cliffy",
);
const latestDiscordDenoRelease = await DenoService.getLatestModuleRelease(
  "discordeno",
);
const latestStdRelease = await DenoService.getLatestModuleRelease("std");

const latestWocketRelease = await GitHubService.getLatestModuleRelease(
  "https://github.com/drashland/wocket",
);

/**
 * @param dir eg "out-of-date-deps"
 */
function defaultDepsBackToOriginal(dir: string): void {
  const pathToOriginal = "tests/integration/" + dir + "/original_deps.ts";
  const pathToMain = "tests/integration/" + dir + "/deps.ts";
  Deno.copyFileSync(pathToOriginal, pathToMain);
}

Deno.test({
  name: "Should update modules",
  async fn(): Promise<void> {
    defaultDepsBackToOriginal("out-of-date-deps");
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "--allow-write",
        "../../../mod.ts",
        "update",
      ],
      cwd: outOfDateDepsDir,
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    const output = await p.output();
    await p.close();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    const assertedOutput = colours.green("[INFO]") +
      " Gathering information on your dependencies...\n" +
      colours.green("[INFO]") +
      " Checking if your modules can be updated...\n" +
      colours.green("[INFO]") +
      ` drash was updated from v1.0.0 to ${latestDrashRelease}\n` +
      colours.green("[INFO]") +
      ` fs was updated from 0.53.0 to ${latestStdRelease}\n` +
      colours.green("[INFO]") +
      ` fmt was updated from 0.53.0 to ${latestStdRelease}\n` +
      colours.green("[INFO]") +
      ` cliffy was updated from 0.11.2 to ${latestCliffyRelease}\n` +
      colours.green("[INFO]") +
      ` log was updated from 0.53.0 to ${latestStdRelease}\n` +
      colours.green("[INFO]") +
      ` uuid was updated from 0.61.0 to ${latestStdRelease}\n` +
      colours.green("[INFO]") +
      ` wocket was updated from v0.4.0 to ${latestWocketRelease}\n` +
      colours.green("[INFO]") +
      ` discordeno was updated from 13.0.0-rc34 to ${latestDiscordDenoRelease}\n`;
    assertEquals(stdout, assertedOutput);
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
    const originalDepContent = new TextDecoder("utf-8").decode(
      Deno.readFileSync(outOfDateOriginalDepsFile),
    );
    const newDepContent = new TextDecoder("utf-8").decode(
      Deno.readFileSync(outOfDateDepsFile),
    );
    assertEquals(newDepContent !== originalDepContent, true);
    assertEquals(
      newDepContent.indexOf(`std@${latestStdRelease}/fs`) !==
        -1,
      true,
    );
    assertEquals(
      newDepContent.indexOf(`std@${latestStdRelease}/fmt`) !==
        -1,
      true,
    );
    assertEquals(
      newDepContent.indexOf(`drash@${latestDrashRelease}`) !== -1,
      true,
    );
    defaultDepsBackToOriginal("out-of-date-deps");
  },
});

Deno.test({
  name: "Should be OK if no modules need to be updated",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "--allow-write",
        "../../../mod.ts",
        "update",
      ],
      cwd: upToDateDepsDir,
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    const output = await p.output();
    await p.close();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(
      stdout,
      colours.green("[INFO]") +
        " Gathering information on your dependencies...\n" +
        colours.green("[INFO]") +
        " Checking if your modules can be updated...\n" +
        colours.green("[INFO]") + " Everything is already up to date\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
    const originalDepContent = new TextDecoder("utf-8").decode(
      Deno.readFileSync(upToDateOriginalDepsFile),
    );
    const newDepContent = new TextDecoder("utf-8").decode(
      Deno.readFileSync(upToDateDepsFile),
    );
    assertEquals(newDepContent === originalDepContent, true);
  },
});

Deno.test({
  name:
    "Should update when a custom dependency file path is given",
  async fn(): Promise<void> {
    defaultDepsBackToOriginal("out-of-date-deps");
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "--allow-write",
        "../../../mod.ts",
        "update",
        "--deps-file",
        "../out-of-date-deps/deps.ts",
      ],
      cwd: upToDateDepsDir,
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    const output = await p.output();
    await p.close();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(
      stdout,
      colours.green("[INFO]") +
        " Gathering information on your dependencies...\n" +
        colours.green("[INFO]") +
        " Checking if your modules can be updated...\n" +
        colours.green("[INFO]") +
        ` drash was updated from v1.0.0 to ${latestDrashRelease}\n` +
        colours.green("[INFO]") +
        ` fs was updated from 0.53.0 to ${latestStdRelease}\n` +
        colours.green("[INFO]") +
        ` fmt was updated from 0.53.0 to ${latestStdRelease}\n` +
        colours.green("[INFO]") +
        ` cliffy was updated from 0.11.2 to ${latestCliffyRelease}\n` +
        colours.green("[INFO]") +
        ` log was updated from 0.53.0 to ${latestStdRelease}\n` +
        colours.green("[INFO]") +
        ` uuid was updated from 0.61.0 to ${latestStdRelease}\n` +
        colours.green("[INFO]") +
        ` wocket was updated from v0.4.0 to ${latestWocketRelease}\n` +
        colours.green("[INFO]") +
        ` discordeno was updated from 13.0.0-rc34 to ${latestDiscordDenoRelease}\n`,
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
    const originalDepContent = new TextDecoder("utf-8").decode(
      Deno.readFileSync(outOfDateOriginalDepsFile),
    );
    const newDepContent = new TextDecoder("utf-8").decode(
      Deno.readFileSync(outOfDateDepsFile),
    );
    assertEquals(newDepContent !== originalDepContent, true);
    assertEquals(
      newDepContent.indexOf(`std@${latestStdRelease}/fs`) !==
        -1,
      true,
    );
    defaultDepsBackToOriginal("out-of-date-deps");
  },
});
