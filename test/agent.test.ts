import { expect, it } from 'vitest';

import * as api from '../src/index.js';

it('should find almost one agent (pnpm)', async () => {
  const agents = await api.detectInstalledAgents();

  expect(agents.has('pnpm')).toBe(true);
});
