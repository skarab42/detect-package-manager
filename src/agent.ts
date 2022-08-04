import { tryGetCommandVersion } from './version.js';

export const agents = ['bun', 'pnpm', 'yarn', 'npm'] as const;

export type AgentName = typeof agents[number];

export interface Agent {
  name: AgentName;
  version: string | undefined;
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
