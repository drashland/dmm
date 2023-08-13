import { assertEquals } from "../../deps.ts";
import { upToDateDepsDir } from "./test_constants.ts";
import { version } from "../../src/commands/version.ts";

Deno.test({
  name: "Should output the version correctly",
  async fn(): Promise<void> {
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-net",
        "../../../mod.ts",
        "--version",
      ],
      cwd: upToDateDepsDir,
      stdout: "piped",
      stderr: "piped",
    });
    const { code, stdout, stderr } = await command.output();
    const out = new TextDecoder("utf-8").decode(stdout).replace(
      /(\r\n|\n|\r)/gm,
      "",
    );
    const err = new TextDecoder("utf-8").decode(stderr);
    assertEquals(out, `Deno Module Manager v${version}`);
    assertEquals(err, "");
    assertEquals(code, 0);
  },
});
