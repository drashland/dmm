import { assertEquals } from "../deps.ts"

// Check a specific dep that can be updated
Deno.test({
    name: 'Info | Module Omitted | Should fail',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info"],
            cwd: "./tests/out-of-date-deps",
            stdout: "null"
        })
        const status = await p.status()
        p.close()
        assertEquals(status.code, 1)
        assertEquals(status.success, false)
    }
})

// Check a specific dep that is already up to date
Deno.test({
    name: 'Info | 3rd Party Module | Should pass',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info", "drash"],
            cwd: "./tests/up-to-date-deps",
            stdout: "null"
        })
        const status = await p.status()
        p.close()
        assertEquals(status.code, 0)
        assertEquals(status.success, true)
    }
})


// Check a list of deps that can be updated
Deno.test({
    name: 'Info | std Module | Should pass',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info", "fs"],
            cwd: "./tests/out-of-date-deps",
            stdout: "null"
        })
        const status = await p.status()
        p.close()
        assertEquals(status.code, 0)
        assertEquals(status.success, true)
    }
})

// Check a list of deps that are already up to date
Deno.test({
    name: 'Info | Multiple Modules | Should fail',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "../../mod.ts", "info", "fs", "drash"],
            cwd: "./tests/up-to-date-deps",
            stdout: "null"
        })
        const status = await p.status()
        p.close()
        assertEquals(status.code, 1)
        assertEquals(status.success, false)
    }
})