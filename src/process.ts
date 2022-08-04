import { promisify } from 'node:util';
import { exec } from 'node:child_process';

/**
 * Promisified version of child_process {@link exec}.
 */
export const execAsync = promisify(exec);
