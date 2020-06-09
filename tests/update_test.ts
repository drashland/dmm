// Update a specific dep that can be updated
import { assertEquals } from "../deps.ts";

// Deno.test({
//     name: 'Update | Single | Modules to Update Exist',
//     async fn(): Promise<void> {
//
//     }
// })
//
// // Update a specific dep that is already up to date
// Deno.test({
//     name: 'Update | Single | No Modules to Update',
//     async fn(): Promise<void> {
//
//     }
// })
//
// // Update many deps that can be updated
// Deno.test({
//     name: 'Update | Many | Modules to Update Exist',
//     async fn(): Promise<void> {
//
//     }
// })
//
// // Update many deps that are already up to date
// Deno.test({
//     name: 'Update | Many | No Modules to Update',
//     async fn(): Promise<void> {
//
//     }
// })
//
// Deno.test({
//     name: 'Update | All | Modules to Update Exist',
//     async fn(): Promise<void> {
//
//     }
// })
//
// Deno.test({
//     name: 'Update | All | Modules to Update Exist',
//     async fn(): Promise<void> {
//
//     }
// })
//
// Deno.test({
//     name: 'Update | Single | std',
//     async (): Promise<void> {
//
//     }
// })
//
// Deno.test({
//     name: 'Update | Single | 3rd Party',
//     async fn(): Promise<void> {
//
//     }
// })

// Deno.test({
//     name: 'Update | Modules Dont Exist in Dependencies',
//     async fn(): Promise<void> {
//         const p = await Deno.run({
//             cmd: ["deno", "run", "--allow-net", "--allow-read", "../../mod.ts", "update", "denon", "io"],
//             cwd: "./tests/up-to-date-deps",
//             stdout: "null"
//         })
//         const status = await p.status()
//         p.close()
//         assertEquals(status.code, 1)
//         assertEquals(status.success, false)
//     }
// })
