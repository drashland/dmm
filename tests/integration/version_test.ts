import { assertEquals } from "../../deps.ts";
import { upToDateDepsDir } from "./test_constants.ts";
import { version } from "../../src/commands/version.ts";

Deno.test({
  name: "Version",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "../../../mod.ts", "--version"],
      cwd: upToDateDepsDir,
      stdout: "piped",
      stderr: "piped",
    });
    const status = await p.status();
    const output = await p.output();
    await p.close();
    const stdout = new TextDecoder("utf-8").decode(output).replace(
      /(\r\n|\n|\r)/gm,
      "",
    ); // regex to strip line break
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    // reference: https://regexr.com/39s32
    const reg =
      /^((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/;
    const splittedStdout = stdout.split(" ");
    console.log(stdout);
    assertEquals(stdout, `Deno Module Manager v${version}`);
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});
