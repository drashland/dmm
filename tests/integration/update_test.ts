// Update a specific dep that can be updated
import { assertEquals, colours } from "../../deps.ts";
import DenoService from "../../src/services/deno_service.ts";
import {
  upToDateDepsDir,
  outOfDateDepsDir,
  outOfDateDepsFile,
  outOfDateOriginalDepsFile,
  upToDateDepsFile,
  upToDateOriginalDepsFile,
} from "./test_constants.ts";

const latestDrashRelease = await DenoService.getLatestThirdPartyRelease(
  "drash",
);

/**
 * @param dir eg "out-of-date-deps"
 */
function defaultDepsBackToOriginal(dir: string): void {
  const pathToOriginal = "tests/integration/" + dir + "/original_deps.ts";
  const pathToMain = "tests/integration/" + dir + "/deps.ts";
  const originalContent = new TextDecoder().decode(
    Deno.readFileSync(pathToOriginal),
  );
  Deno.writeFileSync(pathToMain, new TextEncoder().encode(originalContent));
}

/**
 * @param dir eg "out-of-date-deps"
 */
function emptyDependencyFile(dir: string): void {
  const path = "tests/" + dir + "/deps.ts";
  Deno.writeFileSync(path, new TextEncoder().encode(""));
}

/**
 * @param dir eg "out-of-date-deps" --> "tests/out-of-date-deps/deps.ts
 */
function removeDependencyFile(dir: string): void {
  try {
    const path = "tests/" + dir + "/deps.ts";
    Deno.removeSync(path);
  } catch (err) {
  }
}

Deno.test({
  name: "Update | Single | Modules to Update Exist",
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
        "fs",
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
    const expected = "Gathering facts...\n" +
      "Reading deps.ts to gather your dependencies...\n" +
      "Checking if your modules can be updated...\n" +
      colours.green(
        `fs was updated from 0.53.0 to ${DenoService.getLatestStdRelease()}`,
      ) + "\n";
    assertEquals(
      stdout,
      expected,
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
      newDepContent.indexOf(`std@${DenoService.getLatestStdRelease()}/fs`) !==
        -1,
      true,
    );
    defaultDepsBackToOriginal("out-of-date-deps");
  },
});
//
// Update a specific dep that is already up to date
Deno.test({
  name: "Update | Single | No Modules to Update",
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
        "fs",
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
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Checking if your modules can be updated...\n" +
        colours.green("Everything is already up to date") + "\n",
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

// Update many deps that can be updated
Deno.test({
  name: "Update | Many | Modules to Update Exist",
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
        "fs",
        "fmt",
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
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Checking if your modules can be updated...\n" +
        colours.green(
          `fs was updated from 0.53.0 to ${DenoService.getLatestStdRelease()}`,
        ) + "\n" +
        colours.green(
          `fmt was updated from 0.53.0 to ${DenoService.getLatestStdRelease()}`,
        ) + "\n",
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
      newDepContent.indexOf(`std@${DenoService.getLatestStdRelease()}/fs`) !==
        -1,
      true,
    );
    assertEquals(
      newDepContent.indexOf(`std@${DenoService.getLatestStdRelease()}/fmt`) !==
        -1,
      true,
    );
    defaultDepsBackToOriginal("out-of-date-deps");
  },
});

// Update many deps that are already up to date
Deno.test({
  name: "Update | Many | No Modules to Update",
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
        "fs",
        "fmt",
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
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Checking if your modules can be updated...\n" +
        colours.green("Everything is already up to date") + "\n",
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
  name: "Update | All | Modules to Update Exist",
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
    const assertedOutput = "Gathering facts...\n" +
      "Reading deps.ts to gather your dependencies...\n" +
      "Checking if your modules can be updated...\n" +
      colours.green(`drash was updated from v1.0.0 to ${latestDrashRelease}`) +
      "\n" +
      colours.green(
        `fs was updated from 0.53.0 to ${DenoService.getLatestStdRelease()}`,
      ) + "\n" +
      colours.green(
        `fmt was updated from 0.53.0 to ${DenoService.getLatestStdRelease()}`,
      ) + "\n";
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
      newDepContent.indexOf(`std@${DenoService.getLatestStdRelease()}/fs`) !==
        -1,
      true,
    );
    assertEquals(
      newDepContent.indexOf(`std@${DenoService.getLatestStdRelease()}/fmt`) !==
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
  name: "Update | All | Modules to Update Don't Exist",
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
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Checking if your modules can be updated...\n" +
        colours.green("Everything is already up to date") + "\n",
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
  name: "Update | Single | Third Party",
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
        "drash",
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
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Checking if your modules can be updated...\n" +
        colours.green(
          `drash was updated from v1.0.0 to ${latestDrashRelease}`,
        ) + "\n",
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
      newDepContent.indexOf(`drash@${latestDrashRelease}`) !== -1,
      true,
    );
    defaultDepsBackToOriginal("out-of-date-deps");
  },
});

Deno.test({
  name: "Update | Modules Dont Exist in Dependencies",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../../mod.ts",
        "update",
        "denon",
        "io",
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
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n",
    );
    assertEquals(
      stderr,
      colours.red("Modules specified do not exist in your dependencies.") +
        "\n",
    );
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
    const originalDepContent = new TextDecoder("utf-8").decode(
      Deno.readFileSync(outOfDateOriginalDepsFile),
    );
    const newDepContent = new TextDecoder("utf-8").decode(
      Deno.readFileSync(outOfDateDepsFile),
    );
    assertEquals(newDepContent === originalDepContent, true);
  },
});

Deno.test({
  name: "Update | single | Keeps the `v` if it exists in the imported version",
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
        "fmt",
        "drash",
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
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Checking if your modules can be updated...\n" +
        colours.green(
          `drash was updated from v1.0.0 to ${latestDrashRelease}`,
        ) + "\n" +
        colours.green(
          `fmt was updated from 0.53.0 to ${DenoService.getLatestStdRelease()}`,
        ) + "\n",
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
      newDepContent.indexOf(`std@${DenoService.getLatestStdRelease()}/fmt`) !==
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
  name:
    "Update | single | Omits a `v` if it is not present in the imported version",
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
        "fs",
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
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Checking if your modules can be updated...\n" +
        colours.green(
          `fs was updated from 0.53.0 to ${DenoService.getLatestStdRelease()}`,
        ) + "\n",
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
      newDepContent.indexOf(`std@${DenoService.getLatestStdRelease()}/fs`) !==
        -1,
      true,
    );
    defaultDepsBackToOriginal("out-of-date-deps");
  },
});
