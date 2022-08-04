import { execAsync } from './process.js';

export const validVersionPattern = /^\d+\.\d+\.\d+$/;

/**
 * Returns the version number for a given command name.
 *
 * @example
 * ```
 * const pnpmVersion = await getCommandVersion('pnpm');
 * // -> '7.6.0'
 * ```
 *
 * @param commandName command name such as 'pnpm'.
 * @throws {Error} if the version is not valid or the command does not exist.
 */
export async function getCommandVersion(commandName: string): Promise<string> {
  const childProcess = await execAsync(`${commandName} --version`);
  const version = childProcess.stdout.trim().replace(/^v/i, '');

  if (!validVersionPattern.test(version)) {
    throw new Error(`Unknown command version from "${commandName} --version".`);
  }

  return version;
}

/**
 * Returns the version number for a given command name or undefined if the version is not valid or the command does not exist.
 *
 * @see {@link getCommandVersion}
 *
 * @param commandName command name such as 'pnpm'.
 */
export async function tryGetCommandVersion(commandName: string): Promise<string | undefined> {
  try {
    return await getCommandVersion(commandName);
  } catch {
    return undefined;
  }
}
