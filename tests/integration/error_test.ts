import { assertEquals, colours } from "../../deps.ts";
import { upToDateDepsDir } from "./test_constants.ts";
import { expectedHelpMessage } from "../data/expected_help_message.ts";

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
      expectedHelpMessage,
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
      colours.red("[ERROR] ") +
        "Command 'dmm' used incorrectly. Error(s) found:\n\n  * Unknown argument(s) provided: something.\n\nUSAGE\n\n    dmm [option]\n    dmm [subcommand]\n\n    Run `dmm --help` for more information.\n",
    );
    assertEquals(stderr, "");
    assertEquals(status.code, 1);
    assertEquals(status.success, false);
  },
});
