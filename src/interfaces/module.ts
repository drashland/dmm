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
 * moduleURL
 *     The import URL of the module
 *
 * resposityURL
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
  moduleURL: string;
  repositoryURL: string;
  latestRelease: string;
  description: string;
}
