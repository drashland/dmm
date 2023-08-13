import { assertEquals } from "../../deps.ts";
import { upToDateDepsDir } from "./test_constants.ts";
import { expectedHelpMessage } from "../data/expected_help_message.ts";

Deno.test({
  name: "Should display the help text",
  async fn(): Promise<void> {
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "run",
        "--allow-net",
        "../../../mod.ts",
        "--help",
      ],
      cwd: upToDateDepsDir,
      stdout: "piped",
      stderr: "piped",
    });
    const { code, stdout, stderr } = await command.output();
    const out = new TextDecoder("utf-8").decode(stdout);
    const err = new TextDecoder("utf-8").decode(stderr);
    assertEquals(err, "");
    assertEquals(
      out,
      expectedHelpMessage,
    );
    assertEquals(code, 0);
  },
});
