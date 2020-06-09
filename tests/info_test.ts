import { assertEquals, colours } from "../deps.ts";

// Check a specific dep that can be updated
Deno.test({
  name: "Info | Module Omitted | Should fail",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info"],
      cwd: "./tests/out-of-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
    const output = await p.output();
    await p.close();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(stdout, "Gathering facts...\n");
    assertEquals(
      stderr,
      colours.red("Specify a single module to get information on. See --help") +
        "\n",
    );
  },
});

// Check a specific dep that is already up to date
Deno.test({
  name: "Info | 3rd Party Module | Should pass",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info", "drash"],
      cwd: "./tests/up-to-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
    const output = await p.output();
    await p.close();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "\n" +
        "Information on drash\n" +
        "\n" +
        "  - Name: drash\n" +
        "  - Description: A REST microframework for Deno.\n" +
        "  - deno.land Link: https://deno.land/x/drash@v1.0.5\n" +
        "  - GitHub Repository: https://github.com/drashland/deno-drash\n" +
        '  - Import Statement: import * as drash from \"https://deno.land/x/drash@v1.0.5\";\n' +
        "  - Latest Version: v1.0.5\n" +
        "\n",
    );
    assertEquals(stderr, "");
  },
});

// Check a list of deps that can be updated
Deno.test({
  name: "Info | std Module | Should pass",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info", "fs"],
      cwd: "./tests/out-of-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
    const output = await p.output();
    await p.close();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(
      stdout,
      "Gathering facts...\n" +
        "\n" +
        "Information on fs\n" +
        "\n" +
        "  - Name: fs\n" +
        "  - Description: Cannot retrieve descriptions for std modules\n" +
        "  - deno.land Link: https://deno.land/std@0.56.0/fs\n" +
        "  - GitHub Repository: https://github.com/denoland/deno/tree/master/std/fs\n" +
        '  - Import Statement: import * as fs from \"https://deno.land/std@0.56.0/fs\";\n' +
        "  - Latest Version: 0.56.0\n" +
        "\n",
    );
    assertEquals(stderr, "");
  },
});

// Check a list of deps that are already up to date
Deno.test({
  name: "Info | Multiple Modules | Should fail",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "../../mod.ts",
        "info",
        "fs",
        "drash",
      ],
      cwd: "./tests/up-to-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
    const output = await p.output();
    await p.close();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(stdout, "Gathering facts...\n");
    assertEquals(
      stderr,
      colours.red("Specify a single module to get information on. See --help") +
        "\n",
    );
  },
});

Deno.test({
  name: "Info | Invalid Module | Should fail",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "../../mod.ts",
        "info",
        "somethinggg",
      ],
      cwd: "./tests/up-to-date-deps",
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
    const output = await p.output();
    await p.close();
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(stdout, "Gathering facts...\n");
    assertEquals(
      stderr,
      colours.red("No module was found with somethinggg") + "\n",
    );
  },
});
