# @skarab/detect-package-manager

Detects which package manager (bun, pnpm, yarn, npm) to use based on the current working directory.

## Features

- Support `packageManager` field in `package.json`.
- Detect PM agent version from lock file name, format or version.
- Fully typed and well tested!

_TODO_

- Resolve external lock file such as `lockfile-directory` in `.npmrc` (PR welcome).

## Installation

```bash
pnpm add @skarab/detect-package-manager
```

## Usage

Detect the PM agent from the current working directory.

```ts
import { detectAgent } from '@skarab/detect-package-manager';

const agent = await detectAgent();

console.log(agent); // { name: 'pnpm', version: '7.6.0' }
```

Detect the PM agent from a provided directory.

```ts
import { detectAgent } from '@skarab/detect-package-manager';

const agent = await detectAgent('path/to/yarn/project');

console.log(agent); // { name: 'yarn', version: '1.22.17' }
```

Detect all installed and [known](#known-agents) agents.

```ts
import { detectInstalledAgents } from '@skarab/detect-package-manager';

const agents = await api.detectInstalledAgents();

console.log(agents.has('pnpm')); // true

// agents === Map(3) {
//   'pnpm' => { name: 'pnpm', version: '7.6.0' },
//   'yarn' => { name: 'yarn', version: '1.22.17' },
//   'npm' => { name: 'npm', version: '8.13.2' }
// }
```

## Known agents

- [bun](https://bun.sh/) Bun is a fast all-in-one JavaScript runtime.
- [pnpm](https://pnpm.io/) Fast, disk space efficient package manager.
- [yarn](https://yarnpkg.com/) Yarn is a package manager that doubles down as project manager.
- [npm](https://www.npmjs.com/package/npm) A JavaScript package manager.

## Related

- [detect-package-manager](https://github.com/egoist/detect-package-manager) Detect which package manager you're using (yarn or pnpm or npm)
- [preferred-pm](https://github.com/zkochan/packages/tree/main/preferred-pm) Returns the preferred package manager of a project
- [@antfu/ni](https://github.com/antfu/ni) Use the right package manager

---

Scaffolded with [@skarab/skaffold](https://www.npmjs.com/package/@skarab/skaffold)
