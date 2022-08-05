import { expect, it } from 'vitest';
import { resolve } from 'node:path';
import { fixturesPath } from '../fixtures/index.js';

import * as api from '../../src/index.js';

it('should find bun from package.json', async () => {
  const agent = await api.detectAgent(resolve(fixturesPath, 'agents/bun'));

  expect(agent).toStrictEqual({ name: 'bun', version: '0.1.6' });
});

it('should find bun from lock file', async () => {
  const agent = await api.detectAgent(resolve(fixturesPath, 'agents/bun/lock-version-0'));

  expect(agent).toStrictEqual({ name: 'bun', version: '>=0' });
});
