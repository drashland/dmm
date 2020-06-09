import { assertEquals, colours } from "../deps.ts";

Deno.test({
  name: "Help",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "../../mod.ts", "--help"],
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
      "\n" +
        "A module manager for Deno.\n" +
        "\n" +
        "USAGE:\n" +
        "    deno run --allow-read --allow-net [--allow-write] https://deno.land/x/dmm@v1.0.3/mod.ts [ARGS] [MODULES]\n" +
        "\n" +
        "    dmm [ARGS] [MODULES]\n" +
        "\n" +
        "ARGUMENTS:\n" +
        "The check and update arguments cannot be used together.\n" +
        "\n" +
        "    check\n" +
        "        Checks the specified modules for newer version. Will check all if modules are omitted.\n" +
        "\n" +
        "    update\n" +
        "        Updates the specified modules to the newest version. Will update all if modules are omitted.\n" +
        "\n" +
        "     info\n" +
        "        Shows information about the given module, be it std or 3rd party. The 3rd party module must be referenced at https://deno.land/x/\n" +
        "\n" +
        "EXAMPLE USAGE:\n" +
        "    Assume you are importing an out of date version of `fs` from `std`.\n" +
        "    deno run --allow-net --allow-read https://deno.land/x/dmm@v1.0.3/mod.ts check fs\n" +
        "    deno run --allow-net --allow-read --allow-write https://deno.land/x/dmm@v1.0.3/mod.ts update fs\n" +
        "    deno run --allow-net https://deno.land/x/dmm@v1.0.3/mod.ts info http\n" +
        "    dmm info http\n" +
        "\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});
