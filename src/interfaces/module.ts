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
 * importUrl
 *     The import URL of the module
 *
 * repositoryUrl
 *     The URL for the code repository for the module. 
 *     This is always a github.com URL for a deno.land module.
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
  importUrl: string;
  repositoryUrl: string;
  latestRelease: string;
  description: string;
}
