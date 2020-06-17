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
    const stdout = new TextDecoder("utf-8").decode(output);
    const error = await p.stderrOutput();
    const stderr = new TextDecoder("utf-8").decode(error);
    assertEquals(stderr, "");
    assertEquals(
      stdout,
      "dmm 1.0.5\n",
    );
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});
