import {assertEquals} from "../deps.ts";

Deno.test({
    name: 'Help',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "../../mod.ts", "--help"],
            cwd: "./tests/up-to-date-deps",
            stdout: "null"
        })
        const status = await p.status()
        const error = await p.stderr
        p.close()
        assertEquals(status.code, 0)
        assertEquals(status.success, true)
        assertEquals(error, undefined)
    }
})