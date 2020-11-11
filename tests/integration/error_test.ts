import { assertEquals, colours } from "../../deps.ts";
import { outOfDateDepsDir, upToDateDepsDir } from "./test_constants.ts";

Deno.test({
  name: "No Purpose",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "--allow-read", "../../../mod.ts"],
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
      `
A module manager for Deno.

USAGE

    deno install --allow-net='x.nest.land,cdn.deno.land,api.deno.land,raw.githubusercontent.com,github.com,api.github.com' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v1.2.0/mod.ts
    dmm [SUBCOMMAND]

SUBCOMMANDS

    check [modules]
        Checks the specified modules for newer version. Will check all if modules are 
        omitted.

    update [modules]
        Updates the specified modules to the newest version. Will update all if modules 
        are omitted.

    info [modules]
        Displays information about the given modules, be it std or 3rd party. The 3rd 
        party module must be referenced at https://deno.land/x/

    help, --help
        Prints the help message

    version, --version
        Prints the current dmm version


EXAMPLE USAGE

    Install dmm
        deno install --allow-net='x.nest.land,cdn.deno.land,api.deno.land,raw.githubusercontent.com,github.com,api.github.com' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v1.2.0/mod.ts

    Check a single module
        dmm check fs

    Update a single module
        dmm update fs

    Get information about a module
        dmm info http

`,
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});

Deno.test({
  name: "Purpose is Not Supported",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: [
        "deno",
        "run",
        "--allow-net",
        "--allow-read",
        "../../../mod.ts",
        "something",
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
      colours.red("ERROR") + " Subcommand `something` not recognized.\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});
