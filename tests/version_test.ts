import { assertEquals } from "../deps.ts";

Deno.test({
  name: "Version",
  async fn(): Promise<void> {
    const p = await Deno.run({
      cmd: ["deno", "run", "--allow-net", "../../mod.ts", "--version"],
      cwd: "./tests/up-to-date-deps",
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
    assertEquals(splittedStdout.length, 2);
    assertEquals(splittedStdout[0], "dmm");
    assertEquals(reg.test(splittedStdout[1]), true);
    assertEquals(stderr, "");
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});
