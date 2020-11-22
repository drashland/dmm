import { assertEquals, colours } from "../../deps.ts";
import { version } from "../../src/commands/version.ts";
import { outOfDateDepsDir, upToDateDepsDir } from "./test_constants.ts";
import {expectedHelpMessage} from "../data/expected_help_message.ts";

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
      expectedHelpMessage,
    );
    assertEquals(status.code, 0);
    assertEquals(status.success, true);
  },
});
