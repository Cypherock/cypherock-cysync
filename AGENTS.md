# Cypherock CySync

Multi-platform cryptocurrency wallet management app (desktop via Electron, CLI via oclif) with hardware wallet integration through Cypherock SDK. TypeScript/React monorepo managing 11 blockchain families.

## Tech Stack

- **Language:** TypeScript 4.9.5, Node.js >= 18
- **Frontend:** React 18, styled-components 6, Redux Toolkit
- **Desktop:** Electron 24, Vite 4 (renderer bundler)
- **CLI:** oclif 2.9
- **Monorepo:** pnpm 8.6 workspaces + Turbo 1.13
- **Testing:** Jest 29, Playwright 1.35 (e2e), Stryker (mutation)
- **Linting:** ESLint (Airbnb), Prettier, commitlint (conventional commits)
- **Hardware SDK:** Git submodule at `submodules/sdk/`, communicates via protobuf

## Project Structure

```
apps/
  desktop/          Electron app (main + renderer via Vite)
  cli/              oclif-based CLI
packages/
  cysync-core/      Main business logic: pages, Redux store, contexts, hooks, background tasks
  cysync-core-workers/  Web Workers (portfolio calc, bcrypt)
  cysync-core-constants/  Shared constants
  core-services/    Service layer (wallet sync, portfolio, transactions)
  ui/               React component library (Atomic Design, Storybook)
  desktop-ui/       Desktop-specific renderer wrapping cysync-core + ui
  interfaces/       Shared TypeScript interfaces (ILogger, etc.)
  coins/            Static coin metadata and token definitions per family
  coin-support-interfaces/  CoinSupport interface contract
  coin-support-utils/       Shared coin operation utilities (Observable factories)
  coin-support/     Central registry mapping coin families to implementations
  coin-support-{btc,evm,solana,near,tron,xrp,stellar,starknet,icp,sia,canton}/
  database/         Encrypted DB with Repository pattern, Zod validation
  db-interfaces/    Database entity types and error classes
  utils/            Common utilities (HTTP, logging)
  app-support-buy-sell-2/   Buy/sell feature
  app-support-inheritance/  Inheritance feature
  automation-scripts/       ERC20 list generation
  util-{tsconfig,eslint-config,jest-config,prettier-config}/  Shared configs
submodules/sdk/     Cypherock hardware wallet SDK (protobuf-based)
scripts/            Build helpers, watch scripts, clean, prebuild/postbuild
```

## Essential Commands

```bash
pnpm install                # Install all workspace dependencies
pnpm build:submodules       # Build SDK submodule (do this first on fresh clone)
pnpm build                  # Build all packages (Turbo-orchestrated with caching)
pnpm start                  # Start desktop app with hot reload
pnpm dev                    # Dev mode via Turbo
pnpm test                   # Run all Jest tests with coverage aggregation
pnpm e2e                    # Run Playwright e2e tests
pnpm lint                   # ESLint auto-fix all packages
pnpm pretty                 # Prettier format
pnpm storybook              # Storybook dev server (port 6006)
pnpm make                   # Package desktop app (electron-builder)
pnpm make:cli               # Package CLI
pnpm dev:cli -- <ARGS>      # Run CLI in dev
pnpm clean                  # Clean all build artifacts
```

## Key Dependency Flow

```
desktop app -> desktop-ui -> cysync-core -> coin-support -> coin-support-{family}
                                         -> ui (component library)
                                         -> database -> db-interfaces
                                         -> core-services
cli app -> coin-support-{family}, core-services, database
coin-support-{family} -> coin-support-interfaces, coin-support-utils, coins, sdk-app-{family}
```

## Configuration Files

| File | Purpose |
|------|---------|
| `turbo.json` | Build pipeline, caching, task dependencies |
| `pnpm-workspace.yaml` | Workspace definitions (`apps/*`, `packages/*`) |
| `packages/util-eslint-config/` | Shared Airbnb-based ESLint rules |
| `packages/util-jest-config/` | Shared Jest configuration |
| `commitlint.config.js` | Conventional commit enforcement |
| `.changeset/` | Changeset-based versioning |
| `apps/desktop/src/config.ts` | Desktop app config (API endpoints, log level) |
| `apps/desktop/src/featureFlags.ts` | Feature flags |

## Testing

- **Unit:** Jest with ts-jest, per-package `jest.config.js` extending shared config
- **E2E:** Playwright (automated + manual suites)
- **Mutation:** Stryker for quality assurance
- **Fixtures:** `tests/__fixtures__/` or `__fixtures__/` directories
- **Coverage:** Aggregated at root via `scripts/`

## Additional Documentation

Check these when working on specific areas:

| Document | When to read |
|----------|-------------|
| [Architectural Patterns](.agent/docs/architectural-patterns.md) | Understanding design decisions, state management, data flow, IPC |
| [How Coin Support Works](.agent/docs/coin-support/how-coin-support-works.md) | Understanding native-coin architecture: `CoinSupport` contract, operations, `coin-support-utils` factories, UI integration |
| [How Token Support Works](.agent/docs/coin-support/how-token-support-works.md) | Understanding how tokens (ERC-20, SPL, TRC-20, ICRC, Canton) layer on top of native coins, including `automation-scripts` token JSON pipeline |
| [UI Package Guide](.agent/docs/ui-package-guide.md) | Adding or modifying UI components |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | PR guidelines, branch naming, commit conventions |
| [docs/CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md) | Naming conventions, file organization |

## Quick Reference

- Coin families are registered in `packages/coin-support/src/index.ts:15-27`
- The `CoinSupport` interface is defined in `packages/coin-support-interfaces/src/index.ts:46-83`
- Coin metadata types are in `packages/coins/src/types.ts:23-38`
- Redux store shape is in `packages/cysync-core/src/store/store.ts:34-52`
- IPC handlers are registered in `apps/desktop/src/main/ipc/index.ts:20-62`
- Database repositories are in `packages/database/src/repository/`
- UI components: atoms in `packages/ui/src/components/atoms/`, molecules in `packages/ui/src/components/molecules/`
