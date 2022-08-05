import { basename } from 'node:path';
import { readFileSync } from 'node:fs';
import { findFile, walkDirectoryUp } from './fs.js';
import { tryGetCommandVersion } from './version.js';

export const agents = ['bun', 'pnpm', 'yarn', 'npm'] as const;

export type AgentName = typeof agents[number];
export type AgentVersion = string | undefined;

export interface Agent {
  name: AgentName;
  version: AgentVersion;
}

export type AgentMap = Map<AgentName, Agent>;

/**
 * Detects all (known) agents installed on the system.
 */
export async function detectInstalledAgents(): Promise<AgentMap> {
  const agentsFound: AgentMap = new Map();

  for (const name of agents) {
    const version = await tryGetCommandVersion(name);

    if (version) {
      agentsFound.set(name, { name, version });
    }
  }

  return agentsFound;
}

/**
 * Try to find the used agent from a directory with the following rules:
 *
 * - Try to find the agent in `packageManager` field from `package.json`.
 * - If not found, try to find the agent from lock file name.
 * - If not found, stats again in parent directory.
 *
 * @param directory If no directory is provided, the current working directory will be used.
 */
export function detectAgent(directory?: string): Promise<Agent | undefined> {
  return walkDirectoryUp(async (directory) => {
    let agent = await detectAgentFromPackageJSON(directory);

    if (!agent) {
      agent = await detectAgentFromLockFile(directory);
    }

    return agent;
  }, directory);
}

/**
 * Try to find the used agent defined in `packageManager` field from `package.json`.
 *
 * @param directory If no directory is provided, the current working directory will be used.
 */
export async function detectAgentFromPackageJSON(directory = process.cwd()): Promise<Agent | undefined> {
  const packageJSONPath = await findFile('package.json', directory);

  if (!packageJSONPath) {
    return;
  }

  const packageJSONContent = readFileSync(packageJSONPath, 'utf8');
  const { packageManager } = JSON.parse(packageJSONContent) as { packageManager: string | undefined };

  if (!packageManager) {
    return;
  }

  const [name, version] = packageManager.split('@') as [AgentName, AgentVersion];

  return { name, version };
}

export const lockFiles = [
  'pnpm-lock.yaml',
  'yarn.lock',
  'package-lock.json',
  'bun.lockb',
  'shrinkwrap.yaml',
  'npm-shrinkwrap.json',
] as const;

export type LockFileName = typeof lockFiles[number];

export function detectNPMVersionFromLockFile(path: string): Agent {
  // https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json#lockfileversion
  const { lockfileVersion } = JSON.parse(readFileSync(path, 'utf8')) as {
    lockfileVersion: number | undefined;
  };

  switch (lockfileVersion) {
    case 1:
      return { name: 'npm', version: '5 - 6' };
    case 2:
      return { name: 'npm', version: '>=5' };
    case 3:
      return { name: 'npm', version: '>=7' };
    default:
      return { name: 'npm', version: '<5' };
  }
}

export const pnpmLockFileVersionToVersion = {
  '5.4': '>=7.0.0',
  '5.3': '>=6.0.0',
  '5.2': '>=5.10.0',
  '5.1': '>=3.5.0',
  '5.0': '>=3.0.0',
  '4.0': '>=2.17.0',
  '3.9': '>=2.13.3',
  '3.8': '>=2.8.0',
  '3.7': '>=2.0.0',
  '3.6': '>=1.43.0',
  '3.5': '>=1.40.0',
  '3.4': '>=1.23.0',
  '3.3': '>=1.22.0',
  '3.2': '>=1.18.1',
  '3.1': '1.17 - 1.18.0',
  '3': '1 - 1.16',
  '2': '0.62 - 0',
} as const;

export type PNPMLockFileVersion = keyof typeof pnpmLockFileVersionToVersion;

export function detectPNPMVersionFromLockFile(path: string): Agent {
  // https://github.com/pnpm/spec/tree/master/lockfile
  const content = readFileSync(path, 'utf8');
  const [, lockfileVersion] = content.match(/^lockfileVersion: (\d(\.\d)?)$/m) ?? [];

  if (!lockfileVersion) {
    return { name: 'pnpm', version: '<0.62' };
  }

  const version = pnpmLockFileVersionToVersion[lockfileVersion as PNPMLockFileVersion] as string | undefined;

  return { name: 'pnpm', version: version ?? Object.values(pnpmLockFileVersionToVersion)[0] };
}

export const lockFileVersionDetector: Record<LockFileName, (path: string) => Agent> = {
  'pnpm-lock.yaml': detectPNPMVersionFromLockFile,
  'shrinkwrap.yaml': detectPNPMVersionFromLockFile,
  'package-lock.json': detectNPMVersionFromLockFile,
  'npm-shrinkwrap.json': detectNPMVersionFromLockFile,
  'bun.lockb': () => ({ name: 'bun', version: '>=0' }),
  'yarn.lock': (path: string) => {
    // https://github.com/yarnpkg/berry/blob/635ed55d7582fe6ee1af4c4b2e033f0fdc33fd2f/packages/yarnpkg-core/sources/scriptUtils.ts#L87
    const version = /^__metadata:$/m.test(readFileSync(path, 'utf8')) ? '2' : '1';

    return { name: 'yarn', version };
  },
} as const;

/**
 * Try to find the used agent from lock file name and/or content.
 *
 * @param directory If no directory is provided, the current working directory will be used.
 */
export async function detectAgentFromLockFile(directory = process.cwd()): Promise<Agent | undefined> {
  const lockFilePath = await findFile(lockFiles, directory);

  if (!lockFilePath) {
    return;
  }

  return lockFileVersionDetector[basename(lockFilePath) as LockFileName](lockFilePath);
}
