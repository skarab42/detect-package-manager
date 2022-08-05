import { existsSync } from 'node:fs';
import { dirname, resolve as pathResolve } from 'node:path';

export type OnDirectory<ReturnType> = (directory: string) => ReturnType;

/**
 * Executes a callback function with the current directory path as first argument. If the callback function returns a value other than `undefined` then the search is stopped and the value is returned. Otherwise it starts again with the parent directory.
 *
 * @example
 * ```
 * // Find the nearest package.json from current working directory.
 * const packageJSON = walkDirectoryUp(directory => {
 *   const path = resolve(directory, 'package.json');
 *   return existsSync(path) ? path : undefined;
 * });
 * ```
 *
 * @param callback a callback function to be executed on each directory.
 * @param directory the directory where the search begins, default to current working directory.
 */
export async function walkDirectoryUp<ReturnType>(
  callback: OnDirectory<Promise<ReturnType | undefined>>,
  directory = process.cwd(),
): Promise<ReturnType | undefined> {
  const currentDirectory = pathResolve(directory);
  const result = await callback(currentDirectory);

  if (result !== undefined) {
    return result;
  }

  const parentDirectory = dirname(currentDirectory);

  if (parentDirectory === currentDirectory) {
    return;
  }

  return walkDirectoryUp(callback, parentDirectory);
}

/**
 * Returns the absolute path to the first file found in the directory provided or `undefined`.
 *
 * @param fileName file name or array of file name to search.
 * @param directory the directory where the search begins, default to current working directory.
 */
export async function findFile(fileName: string | string[], directory = process.cwd()): Promise<string | undefined> {
  if (typeof fileName === 'string') {
    const path = pathResolve(directory, fileName);

    return existsSync(path) ? path : undefined;
  }

  for (const name of fileName) {
    const file = await findFile(name, directory);

    if (file) {
      return file;
    }
  }

  return;
}
