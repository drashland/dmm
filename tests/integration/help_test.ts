import { assertEquals, colours } from "../../deps.ts";
import { version } from "../../src/commands/version.ts";
import { outOfDateDepsDir, upToDateDepsDir } from "./test_constants.ts";

Deno.test({
  name: "Help",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "../../../mod.ts", "--help"],
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
    assertEquals(stderr, "");
    assertEquals(
      stdout,
      "\nA module manager for Deno.\n" +
        "\n" +
        "USAGE\n" +
        "\n" +
        "    deno install --allow-net='cdn.deno.land,api.deno.land' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v1.1.5/mod.ts\n" +
        "    dmm [command]\n" +
        "\n" +
        "\n" +
        "COMMANDS\n" +
        "\n" +
        "    check [modules]\n" +
        "        Checks the specified modules for newer version. Will check all if modules are \n" +
        "        omitted.\n" +
        "\n" +
        "    update [modules]\n" +
        "        Updates the specified modules to the newest version. Will update all if modules \n" +
        "        are omitted.\n" +
        "\n" +
        "    info\n" +
        "        Shows information about the given module, be it std or 3rd party. The 3rd party \n" +
        "        module must be referenced at https://deno.land/x/\n" +
        "\n" +
        "    --help\n" +
        "        Prints the help message\n" +
        "\n" +
        "    --version\n" +
        "        Prints the current dmm version\n" +
        "\n" +
        "    help\n" +
        "        Prints the help message\n" +
        "\n" +
        "    version\n" +
        "        Prints the current dmm version\n" +
        "\n" +
        "\n" +
        "EXAMPLE USAGE\n" +
        "\n" +
        "    Install dmm\n" +
        "        deno install --allow-net='cdn.deno.land,api.deno.land' --allow-read='.' --allow-write='deps.ts' https://deno.land/x/dmm@v1.1.5/mod.ts\n" +
        "\n" +
        "    Check a single module\n" +
        "        dmm check fs\n" +
        "\n" +
        "    Update a single module\n" +
        "        dmm update fs\n" +
        "\n" +
        "    Get information about a module\n" +
        "        dmm info http" + "\n\n",
    );
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});
