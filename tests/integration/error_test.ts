import { assertEquals, colours } from "../../deps.ts";
import { upToDateDepsDir } from "./test_constants.ts";
import { expectedHelpMessage } from "../data/expected_help_message.ts";

Deno.test({
  name: "No Purpose",
  async fn(): Promise<void> {
    const command = new Deno.Command(
      "deno run --allow-net --allow-read ../../../mod.ts",
      {
        cwd: upToDateDepsDir,
        stdout: "piped",
        stderr: "piped",
      },
    );
    const { code, stdout, stderr } = await command.output();
    const out = new TextDecoder("utf-8").decode(stdout);
    const err = new TextDecoder("utf-8").decode(stderr);
    assertEquals(
      out,
      expectedHelpMessage,
    );
    assertEquals(err, "");
    assertEquals(code, 0);
  },
});

Deno.test({
  name: "Purpose is Not Supported",
  async fn(): Promise<void> {
    const command = new Deno.Command(
      "deno run --allow-net --allow-read ../../../mod.ts something",
      {
        cwd: upToDateDepsDir,
        stdout: "piped",
        stderr: "piped",
      },
    );
    const { code, stdout, stderr } = await command.output();
    const out = new TextDecoder("utf-8").decode(stdout);
    const err = new TextDecoder("utf-8").decode(stderr);
    assertEquals(
      out,
      colours.red("[ERROR] ") +
        "Command 'dmm' used incorrectly. Error(s) found:\n\n  * Unknown argument(s) provided: something.\n\nUSAGE\n\n    dmm [option]\n    dmm [subcommand]\n\n    Run `dmm --help` for more information.\n",
    );
    assertEquals(err, "");
    assertEquals(code, 1);
  },
});
