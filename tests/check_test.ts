import { assertEquals, colours } from "../deps.ts";

// Check a specific dep that can be updated
Deno.test({
  name: "Check | Single | Modules to Update Exist",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../mod.ts",
        "check",
        "fs",
      ],
      cwd: "./tests/out-of-date-deps",
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
        "Comparing versions...\n" +
        colours.yellow("fs can be updated from 0.53.0 to 0.56.0") + "\n" +
        "To update, run: \n" +
        "    dmm update fs" +
        "\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});

// Check a specific dep that is already up to date
Deno.test({
  name: "Check | Single | No Modules to Update",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../mod.ts",
        "check",
        "fs",
      ],
      cwd: "./tests/up-to-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    p.close();
    const output = await p.output();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Comparing versions...\n" +
        colours.green("Your dependencies are up to date") + "\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});

// Check a list of deps that can be updated
Deno.test({
  name: "Check | Many | Modules to Update Exist",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../mod.ts",
        "check",
        "fs",
        "drash",
      ],
      cwd: "./tests/out-of-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    p.close();
    const output = await p.output();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Comparing versions...\n" +
        colours.yellow("drash can be updated from v1.0.0 to v1.0.5") + "\n" +
        colours.yellow("fs can be updated from 0.53.0 to 0.56.0") + "\n" +
        "To update, run: \n" +
        "    dmm update drash fs" +
        "\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});

// Check a list of deps that are already up to date
Deno.test({
  name: "Check | Many | No Modules to Update",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../mod.ts",
        "check",
        "fs",
        "drash",
      ],
      cwd: "./tests/up-to-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    p.close();
    const output = await p.output();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Comparing versions...\n" +
        colours.green("Your dependencies are up to date") + "\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});

// Check every dep and all of them are out of date
Deno.test({
  name: "Check | All | Modules to Update Exist",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../mod.ts",
        "check",
      ],
      cwd: "./tests/out-of-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    p.close();
    const output = await p.output();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Comparing versions...\n" +
        colours.yellow("drash can be updated from v1.0.0 to v1.0.5") + "\n" +
        colours.yellow("fs can be updated from 0.53.0 to 0.56.0") + "\n" +
        colours.yellow("fmt can be updated from v0.53.0 to v0.56.0") + "\n" +
        "To update, run: \n" +
        "    dmm update drash fs fmt" +
        "\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});

// Check every dep and all of them are already up to date
Deno.test({
  name: "Check | All | No Modules to Update",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../mod.ts",
        "check",
      ],
      cwd: "./tests/up-to-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    p.close();
    const output = await p.output();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "Reading deps.ts to gather your dependencies...\n" +
        "Comparing versions...\n" +
        colours.green("Your dependencies are up to date") + "\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});

Deno.test({
  name: "Check | Modules Dont Exist in Dependencies",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../mod.ts",
        "check",
        "denon",
        "io",
      ],
      cwd: "./tests/up-to-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    p.close();
    const output = await p.output();
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
  },
});

Deno.test({
  name: "Check | std | Not Found",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../mod.ts",
        "check",
        "http",
      ],
      cwd: "./tests/up-to-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    p.close();
    const output = await p.output();
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
  },
});

Deno.test({
  name: "Check | 3rd Party | Not Found",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../mod.ts",
        "check",
        "io",
      ],
      cwd: "./tests/up-to-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    p.close();
    const output = await p.output();
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
  },
});
