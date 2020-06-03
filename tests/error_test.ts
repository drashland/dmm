import {assertEquals} from "../deps.ts";

Deno.test({
    name: 'No Purpose',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts"],
            cwd: "./tests/up-to-date-deps",
            stdout: "null"
        })
        const status = await p.status()
        p.close()
        assertEquals(status.code, 1)
        assertEquals(status.success, false)
    }
})

Deno.test({
    name: 'Purpose is Not Supported',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts", "something"],
            cwd: "./tests/up-to-date-deps",
            stdout: "null"
        })
        const status = await p.status()
        p.close()
        assertEquals(status.code, 1)
        assertEquals(status.success, false)
    }
})