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
 * latestRelease
 *     The latest release tag for the module
 */
export default interface IModule {
  std: boolean;
  name: string;
  importedVersion: string;
  importUrl: string;
  latestRelease: string;
}
