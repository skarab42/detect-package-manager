import { expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import * as api from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJSONPath = resolve(__dirname, '../package.json');

it('should find package.json path', async () => {
  const actualPath = await api.findFile('package.json');

  expect(actualPath).toBe(packageJSONPath);
});

it('should find README.md path', async () => {
  const expectedPath = resolve(__dirname, '../README.md');
  const actualPath = await api.findFile(['a_file_that_does_not.exist', 'README.md', 'package.json']);

  expect(actualPath).toBe(expectedPath);
});

it('should find nearest up package.json path', async () => {
  const actualPath = await api.walkDirectoryUp((directory) => {
    return api.findFile('package.json', directory);
  });

  expect(actualPath).toBe(packageJSONPath);
});

it('should not find nearest up package.json path', async () => {
  const actualPath = await api.walkDirectoryUp((directory) => {
    return api.findFile('package.json', directory);
  }, '../..');

  expect(actualPath).toBe(undefined);
});

it('should find nearest up package.json path (deep)', async () => {
  const actualPath = await api.walkDirectoryUp((directory) => {
    return api.findFile('package.json', directory);
  }, './deep/deep/path');

  expect(actualPath).toBe(packageJSONPath);
});
