import { denoStdLatestVersion, colours } from "./deps.ts"

const decoder = new TextDecoder()

export interface Module {
    std: boolean;
    name: string;
    version: string,
    url: string,
    repo?: string,
    latestRelease?: string,
    updated?: boolean
}