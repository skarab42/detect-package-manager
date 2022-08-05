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

```ts
import { detectAgent } from '@skarab/detect-package-manager';

const agent = await detectAgent();

console.log(agent); // { name: 'pnpm', version: '7.6.0' }
```

```ts
import { detectAgent } from '@skarab/detect-package-manager';

const agents = await api.detectInstalledAgents();

console.log(agents.has('pnpm')); // true

// agents === Map(3) {
//   'pnpm' => { name: 'pnpm', version: '7.6.0' },
//   'yarn' => { name: 'yarn', version: '1.22.17' },
//   'npm' => { name: 'npm', version: '8.13.2' }
// }
```

## Related

- [detect-package-manager](https://github.com/egoist/detect-package-manager) Detect which package manager you're using (yarn or pnpm or npm)
- [preferred-pm](https://github.com/zkochan/packages/tree/main/preferred-pm) Returns the preferred package manager of a project
- [@antfu/ni](https://github.com/antfu/ni) Use the right package manager

---

Scaffolded with [@skarab/skaffold](https://www.npmjs.com/package/@skarab/skaffold)
