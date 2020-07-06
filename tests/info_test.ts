import { assertEquals, colours } from "../deps.ts";
import DenoService from "../src/services/deno_service.ts";

// Check a specific dep that can be updated
Deno.test({
  name: "Info | Module Omitted | Should fail",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info"],
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
    assertEquals(stdout, "Gathering facts...\n");
    assertEquals(
      stderr,
      colours.red("Specify a single module to get information on. See --help") +
        "\n",
    );
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
  },
});

// Check a specific dep that is already up to date
Deno.test({
  name: "Info | 3rd Party Module | Should pass",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info", "drash"],
      cwd: "./tests/up-to-date-deps",
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
        "\n" +
        "Information on drash\n" +
        "\n" +
        "  - Name: drash\n" +
        "  - Description: A REST microframework for Deno's HTTP server with zero dependencies.\n" +
        "  - deno.land Link: https://deno.land/x/drash@v1.0.7\n" +
        "  - GitHub Repository: https://github.com/drashland/deno-drash\n" +
        '  - Import Statement: import * as drash from \"https://deno.land/x/drash@v1.0.7\";\n' +
        "  - Latest Version: v1.0.7\n" +
        "\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});

// Check a list of deps that can be updated
Deno.test({
  name: "Info | std Module | Should pass",

  //ignore: true,
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info", "fs"],
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
        "\n" +
        "Information on fs\n" +
        "\n" +
        "  - Name: fs\n" +
        "  - Description: Cannot retrieve descriptions for std modules\n" +
        `  - deno.land Link: https://deno.land/std@${DenoService.getLatestStdRelease()}/fs\n` +
        "  - GitHub Repository: https://github.com/denoland/deno/tree/master/std/fs\n" +
        `  - Import Statement: import * as fs from \"https://deno.land/std@${DenoService.getLatestStdRelease()}/fs\";\n` +
        `  - Latest Version: ${DenoService.getLatestStdRelease()}\n` +
        "\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});

// Check a list of deps that are already up to date
Deno.test({
  name: "Info | Multiple Modules | Should fail",

  //ignore: true,
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
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
  },
});

Deno.test({
  name: "Info | Invalid Module | Should fail",

  //ignore: true,
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
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
  },
});
