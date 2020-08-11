import { assertEquals, colours } from "../../deps.ts";
import { upToDateDepsDir, outOfDateDepsDir } from "./test_constants.ts"

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
    assertEquals(stdout, "");
    assertEquals(stderr, colours.red("Invalid arguments. See --help") + "\n");
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
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
    assertEquals(stdout, "Gathering facts...\n");
    assertEquals(
      stderr,
      colours.red("Specify either `check`, `info` or `update`. See --help") +
        "\n",
    );
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
  },
});
