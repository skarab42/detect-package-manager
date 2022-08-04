import { expect, it } from 'vitest';
import * as api from '../src/index.js';

const versionPattern = /^\d+\.\d+\.\d+$/;

it('should return the pnpm version', async () => {
  expect(await api.getCommandVersion('pnpm')).toMatch(versionPattern);
  await expect(api.getCommandVersion('prout')).rejects.toThrow(Error);

  expect(await api.tryGetCommandVersion('pnpm')).toMatch(versionPattern);
  expect(await api.tryGetCommandVersion('prout')).toBe(undefined);
});
