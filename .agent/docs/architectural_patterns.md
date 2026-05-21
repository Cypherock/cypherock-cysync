# Architectural Patterns

Recurring patterns and design decisions across the codebase. Reference these when modifying or extending existing code.

## 1. Plugin Registry (Coin Support)

Each blockchain family implements the `CoinSupport` interface and is registered in a central map.

- **Interface:** `packages/coin-support-interfaces/src/index.ts:46-83` — 17 methods covering account creation, sync, transactions, signing, price data
- **Registry:** `packages/coin-support/src/index.ts:15-27` — `coinSupportMap: Record<CoinFamily, CoinSupport>`
- **Lookup:** `getCoinSupport(coinFamily)` factory at `packages/coin-support/src/index.ts:29-37`
- **Pattern:** Each `coin-support-{family}/src/index.ts` exports a class implementing `CoinSupport`, delegates to `operations/` subdirectory

## 2. Redux Toolkit State Management

Global state uses Redux Toolkit slices with 17 reducers.

- **Store definition:** `packages/cysync-core/src/store/store.ts:34-52` — `RootState` type
- **Slice pattern:** Each slice in `packages/cysync-core/src/store/{feature}/index.ts` uses `createSlice`
- **Slices:** wallet, lang, dialog, account, device, priceInfo, priceHistory, transaction, discreetMode, accountSync, snackBar, notification, network, inheritance, lastConnectedFirmware, canton, buySellOrder
- **Typed hooks:** `useAppSelector` and `useAppDispatch` exported from store module

## 3. Repository Pattern (Database)

Custom encrypted database with generic repository abstraction.

- **Generic base:** `packages/database/src/repository/Repository.ts` — CRUD + EventEmitter for reactive updates
- **Specialized repos:** `AccountRepository.ts`, `TransactionRepository.ts` in same directory
- **Entities:** `packages/database/src/entity/` — account, transaction, wallet, device, priceInfo, priceHistory, migration, buySellOrder, inheritancePlan
- **Validation:** Zod schemas per entity for runtime type checking
- **Encryption:** `packages/database/src/encryptedDb.ts`
- **DB composition:** `packages/database/src/database.ts:50-73` — Database class composes all repositories

## 4. Observable-Based Async Operations

Long-running operations (sync, sign, create accounts) return RxJS Observables.

- **Factory functions:** `packages/coin-support-utils/src/` provides `makeSignTransactionsObservable`, `makeSyncAccountObservable`, etc.
- **Usage:** Each coin-support package's operation files call these factories with coin-specific callbacks
- **Event pattern:** Observables emit typed events (e.g., `ICreateAccountEvent`, `ISignTransactionEvent`)
- **Subscription:** UI components subscribe via hooks, unsubscribe on unmount

## 5. Electron IPC

Handler-based IPC between main and renderer processes.

- **Handler registration:** `apps/desktop/src/main/ipc/index.ts:20-62` — 50+ handlers and listeners
- **Preload bridge:** `apps/desktop/src/preload/index.ts:14-71` — exposes typed functions and listeners to renderer
- **Handler modules:** `apps/desktop/src/main/ipc/{device,db,autoUpdater}.ts`
- **Pattern:** Main process defines `ipcMain.handle()` handlers; renderer calls via `window.cysyncAPI`

## 6. React Context Providers (DI)

Context-based dependency injection for cross-cutting concerns.

- **Location:** `packages/cysync-core/src/context/`
- **Providers:** device, walletConnect, swap, buySell2, currency, appUpdate, latestDeviceVersion, lockscreen, sidebar
- **Device context:** `packages/cysync-core/src/context/device/index.tsx:45-57` — connection, reconnect, firmware update, authenticate
- **Pattern:** Provider wraps children, custom `useXContext()` hook consumes
- **Helper logic:** Extracted to `helpers.ts` files alongside context definitions

## 7. Background Task Orchestration

React components run parallel background operations.

- **Entry point:** `packages/cysync-core/src/bgTask/index.tsx`
- **Tasks:** accountsSync, pricesSync, walletSyncTask, deviceHandlingTask, versionSync, networkTask, notificationSync, dbListener
- **Pattern:** Each task is a React component that runs side effects via `useEffect`, coordinating with Redux store and database listeners

## 8. Web Workers

CPU-intensive work offloaded to Web Workers with UUID-correlated messaging.

- **Caller factory:** `packages/cysync-core/src/utils/worker/index.ts:80-108` — `createWorkerFunctionCaller` with UUID tracking
- **Worker handlers:** `packages/cysync-core-workers/src/index.ts:5-29` — portfolio graph calculation, bcrypt hash/verify
- **Pattern:** Main thread sends `{id, functionName, args}`, worker responds with `{id, result}`

## 9. Error Handling

Structured error classes with UI-facing error maps.

- **Database errors:** `packages/db-interfaces/src/errors/databaseError.ts`
- **Custom error factory:** `packages/cysync-core/src/utils/customError.ts:3-15`
- **Global handler:** `packages/cysync-core/src/utils/errorHandler.ts`
- **Error maps:** `packages/cysync-core/src/constants/errors/` — deviceError, serverError, databaseError, binanceError, serverCoinError
- **Pattern:** Error type enums map to `ErrorActionMap` (what UI action to take) and `ErrorIconNameMap` (what icon to show)

## 10. Logger Interface

Abstracted logger with scoped instances per package.

- **Interface:** `packages/interfaces/src/logger.ts:1-20` — `ILogger` with info, error, warn, debug, verbose
- **Per-package loggers:** `packages/coin-support-btc/src/utils/logger.ts`, `packages/database/src/utils/logger.ts`, etc.
- **Pattern:** Each package creates a scoped logger instance, exports `updateLogger` for runtime reconfiguration

## 11. Configuration

Per-module config objects with environment variable overrides.

- **Desktop:** `apps/desktop/src/config.ts` — API endpoints, log level, build type, feature flags
- **CLI:** `apps/cli/src/config.ts:1-19` — environment variable override pattern
- **Per-package:** `packages/coin-support-btc/src/config.ts` — API endpoint for that coin
- **Feature flags:** `apps/desktop/src/featureFlags.ts`
- **Pattern:** Static config object, optionally overridden by `process.env` or `window.cysyncEnv`

## 12. Barrel Exports

Every package exposes a clean public API through `index.ts` barrel files.

- **Example:** `packages/coin-support-btc/src/index.ts:29-31` — exports types, services, logger updater
- **Core:** `packages/cysync-core/src/index.ts` — exports pages, theme, constants, context, store, components, bgTask, services
- **Pattern:** Internal module structure is hidden; consumers import from package root

## 13. SDK Integration

Hardware device communication via Cypherock SDK apps.

- **App factory:** Each coin package has `src/utils/app.ts` — e.g., `BtcApp.create(connection)`
- **SDK packages:** `@cypherock/sdk-app-btc`, `@cypherock/sdk-app-evm`, `@cypherock/sdk-app-manager`, etc.
- **Interfaces:** `@cypherock/sdk-interfaces` provides `IDevice`, `IDeviceConnection`
- **Protocol:** Protobuf definitions in `submodules/sdk/submodules/common/proto/`
- **Pattern:** Connection obtained from DeviceContext, passed to SDK app factory, app methods called in operation files

## 14. CLI Command Pattern

oclif commands with base class for shared initialization.

- **Base class:** `apps/cli/src/utils/baseCommand.ts:29-80` — abstract `BaseCommand` with device/database connection flags
- **Initialization:** `connectToDevice` and `connectToDatabase` flags trigger lazy setup
- **Library init:** Base command initializes coin support libraries (BTC, EVM, Solana, etc.)
- **Commands:** `apps/cli/src/commands/{wallet,transaction,device}/`

## 15. Turbo Build Pipeline

Monorepo task orchestration with dependency tracking and caching.

- **Config:** `turbo.json` — defines prebuild, build, dev, test, lint tasks
- **Caching:** Build outputs cached per package; `turbo.json` specifies output globs
- **Special cases:** UI icons generation and cysync-core dependency generation have custom Turbo rules
- **Scripts:** `scripts/watch/`, `scripts/clean.js`, `scripts/prebuild.js` for build automation
