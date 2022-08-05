import { expect, it } from 'vitest';
import { resolve } from 'node:path';
import { fixturesPath } from '../fixtures/index.js';

import * as api from '../../src/index.js';

it('should find yarn from package.json', async () => {
  const agent = await api.detectAgent(resolve(fixturesPath, 'agents/yarn'));

  expect(agent).toStrictEqual({ name: 'yarn', version: '1.22.17' });
});

it('should find yarn from lock file', async () => {
  const agent1 = await api.detectAgent(resolve(fixturesPath, 'agents/yarn/lock-version-1'));
  const agent2 = await api.detectAgent(resolve(fixturesPath, 'agents/yarn/lock-version-2'));

  expect(agent1).toStrictEqual({ name: 'yarn', version: '1' });
  expect(agent2).toStrictEqual({ name: 'yarn', version: '2' });
});
