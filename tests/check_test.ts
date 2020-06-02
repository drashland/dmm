// Check a specific dep that can be updated
Deno.test({
    name: 'Check | Single | Modules to Update Exist',
    async fn(): Promise<void> {
        const p = await Deno.run({
            cmd: ["deno", "--allow-net", "--allow-read", "../mod.ts", "check", "fs"]
        })
        const status = await p.status()
        const error = p.stderr
        // const output = await p.output()
        p.close()
        console.log('done')
        console.log(status)
        console.log(error)
       // console.log(output)
    }
})
//
// // Check a specific dep that is already up to date
// Deno.test({
//     name: 'Check | Single | No Modules to Update',
//     async (): Promise<void> {
//
//     }
// })
//
// // Check a list of deps that can be updated
// Deno.test({
//     name: 'Check | Many | Modules to Update Exist',
//     async (): Promise<void> {
//
//     }
// })
//
// // Check a list of deps that are already up to date
// Deno.test({
//     name: 'Check | Many | No Modules to Update',
//     async (): Promise<void> {
//
//     }
// })
//
// // Check every dep and all of them are out of date
// Deno.test({
//     name: 'Check | All | Modules to Update Exist',
//     async (): Promise<void> {
//         console.log(2)
//     }
// })
//
// // Check every dep and all of them are already up to date
// Deno.test({
//     name: 'Check | All | No Modules to Update',
//     async (): Promise<void> {
//
//     }
// })
//
// Deno.test({
//     name: 'Check | Single | std',
//     async (): Promise<void> {
//
//     }
// })
//
// Deno.test({
//     name: 'Check | Single | 3rd Party',
//     async (): Promise<void> {
//
//     }
// })




