import { expect, it } from 'vitest';
import { resolve } from 'node:path';
import { fixturesPath } from '../fixtures/index.js';

import * as api from '../../src/index.js';

it('should find pnpm from package.json', async () => {
  const agent = await api.detectAgent(resolve(fixturesPath, 'agents/pnpm'));

  expect(agent).toStrictEqual({ name: 'pnpm', version: '7.6.0' });
});

it('should find pnpm from lock file', async () => {
  const agent1 = await api.detectAgent(resolve(fixturesPath, 'agents/pnpm/shrinkwrap'));
  const agent2 = await api.detectAgent(resolve(fixturesPath, 'agents/pnpm/lock-version-3'));
  const agent3 = await api.detectAgent(resolve(fixturesPath, 'agents/pnpm/lock-version-4'));

  expect(agent1).toStrictEqual({ name: 'pnpm', version: '<0.62' });
  expect(agent2).toStrictEqual({ name: 'pnpm', version: '1 - 1.16' });
  expect(agent3).toStrictEqual({ name: 'pnpm', version: '>=2.17.0' });
});
