import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const fixturesPath = dirname(fileURLToPath(import.meta.url));
