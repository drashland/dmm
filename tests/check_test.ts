import { assertEquals } from "../deps.ts"

// Check a specific dep that can be updated
Deno.test({
    name: 'Check | Single | Modules to Update Exist',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts", "check", "fs"],
            cwd: "./tests/out-of-date-deps",
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

// Check a specific dep that is already up to date
Deno.test({
    name: 'Check | Single | No Modules to Update',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts", "check", "fs"],
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


// Check a list of deps that can be updated
Deno.test({
    name: 'Check | Many | Modules to Update Exist',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts", "check", "fs", "drash"],
            cwd: "./tests/out-of-date-deps",
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

// Check a list of deps that are already up to date
Deno.test({
    name: 'Check | Many | No Modules to Update',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts", "check", "fs", "drash"],
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

// Check every dep and all of them are out of date
Deno.test({
    name: 'Check | All | Modules to Update Exist',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts", "check"],
            cwd: "./tests/out-of-date-deps",
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

// Check every dep and all of them are already up to date
Deno.test({
    name: 'Check | All | No Modules to Update',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts", "check"],
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

Deno.test({
    name: 'Check | Modules Dont Exist in Dependencies',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts", "check", "denon", "io"],
            cwd: "./tests/up-to-date-deps",
            stdout: "null"
        })
        const status = await p.status()
        p.close()
        assertEquals(status.code, 1)
        assertEquals(status.success, false)
    }
})