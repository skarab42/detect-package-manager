import { expect, it } from 'vitest';
import { resolve } from 'node:path';
import { fixturesPath } from '../fixtures/index.js';

import * as api from '../../src/index.js';

it('should find npm from package.json', async () => {
  const agent = await api.detectAgent(resolve(fixturesPath, 'agents/npm'));

  expect(agent).toStrictEqual({ name: 'npm', version: '8.13.2' });
});

it('should find npm from lock file', async () => {
  const agent1 = await api.detectAgent(resolve(fixturesPath, 'agents/npm/lock-version-1'));
  const agent2 = await api.detectAgent(resolve(fixturesPath, 'agents/npm/lock-version-2'));
  const agent3 = await api.detectAgent(resolve(fixturesPath, 'agents/npm/lock-version-3'));
  const agent4 = await api.detectAgent(resolve(fixturesPath, 'agents/npm/no-lock-version'));
  const agent5 = await api.detectAgent(resolve(fixturesPath, 'agents/npm/shrinkwrap'));

  expect(agent1).toStrictEqual({ name: 'npm', version: '5 - 6' });
  expect(agent2).toStrictEqual({ name: 'npm', version: '>=5' });
  expect(agent3).toStrictEqual({ name: 'npm', version: '>=7' });
  expect(agent4).toStrictEqual({ name: 'npm', version: '<5' });
  expect(agent5).toStrictEqual({ name: 'npm', version: '<5' });
});
