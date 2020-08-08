/**
 * std
 *     Is the module std?
 *
 * name
 *     Name of the module
 *
 * importedVersion
 *     The version imported for the given module
 *
 * denoLandURL
 *     The https://deno.land/x/ URL to the module
 *
 * githubURL
 *     The https://github.com/ URL for the module
 *
 * latestRelease
 *     The latest release tag for the module
 *
 * description
 *     Description for the module.
 */
export default interface IModule {
  std: boolean;
  name: string;
  importedVersion: string;
  denoLandURL: string;
  githubURL: string;
  latestRelease: string;
  description: string;
}
