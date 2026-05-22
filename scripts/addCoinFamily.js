#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop */

/**
 * Script A — Scaffold a brand-new coin family.
 *
 * Use this only when the chain CANNOT be added to an existing family — i.e.
 * it has a unique transaction model, derivation, or account structure.
 *
 * For an EVM L2 / Bitcoin-fork / anything that fits an existing family, use
 * scripts/addCoin.js instead.
 *
 * Reference: .agent/docs/coin-support/adding-new-coin-family-support.md
 *
 * ----------------------------------------------------------------------------
 * SHORTCOMINGS — READ THESE BEFORE RUNNING
 * ----------------------------------------------------------------------------
 *
 * This script generates ONLY the mechanical boilerplate. It will leave you
 * with a green-building monorepo, but every operation will throw "Not
 * implemented" at runtime until you fill it in. Specifically:
 *
 *  1. NO SDK app integration.
 *     - src/utils/app.ts is a stub that throws. You must:
 *         a. Add the real @cypherock/sdk-app-{family} dependency to
 *            packages/coin-support-{family}/package.json once it exists.
 *         b. Replace the stub in src/utils/app.ts with createApp / getAppletId
 *            using the real SDK app class.
 *         c. If your chain needs a static library-injection method (e.g.
 *            BtcSupport.setBitcoinLibrary), add it to src/index.ts and wire
 *            it into apps/desktop and apps/cli bootstraps.
 *
 *  2. NO real operation implementations.
 *     - Every method in src/index.ts throws "Method not implemented".
 *     - For each operation, read .agent/docs/coin-support/how-coin-support-works.md §4
 *       to learn the factory from @cypherock/coin-support-utils to use and the
 *       callbacks it expects, then implement src/operations/{op}/index.ts.
 *
 *  3. NO derivation schemes.
 *     - If your chain uses multiple derivation schemes (BTC-style legacy/segwit/...),
 *       create src/operations/createAccounts/schemes/ following the BTC reference:
 *       packages/coin-support-btc/src/operations/createAccounts/schemes/.
 *
 *  4. NO chain-specific IPreparedTransaction extension.
 *     - src/operations/transaction.ts defines an empty extension. Add
 *       userInputs / staticData / computedData / validation flags specific to
 *       your chain. See how-coin-support-works.md §3 for reference.
 *
 *  5. UI mappings get NO-OP entries.
 *     - The 4 required Record<CoinFamily, ...> maps in cysync-core get filled
 *       in with no-op values to keep the build green:
 *         * feeInputPropsMap            -> () => ({})
 *         * computedFeeMap              -> () => '0'
 *         * labelSuffixMap              -> getDefaultSuffix
 *         * anaInputMap                 -> {Family}AddressAndAmount (new component)
 *       A new {Family}AddressAndAmount component is inserted into
 *       packages/cysync-core/src/dialogs/Send/Dialogs/Components/AddressAndAmountSection/index.tsx
 *       — same shape as the existing per-family components (single-transaction
 *       only). Customize it once your chain needs extra fields (memo, batch, etc.).
 *     - No icon entry is added to CoinIcon.tsx. Add one once you have an icon
 *       component in @cypherock/cysync-ui (or add it via scripts/addCoin.js
 *       after the family's first coin is registered).
 *     - Conditional branches (Receive context, AddAccount filtering, History,
 *       memo/destination tag/expiration maps) are NOT touched. Review per
 *       how-coin-support-works.md §8 once your chain's quirks are known.
 *
 *  6. Tests are minimal placeholder skeletons.
 *
 * ----------------------------------------------------------------------------
 * TROUBLESHOOTING — IF BUILD / TYPECHECK FAILS
 * ----------------------------------------------------------------------------
 *
 *  • "Property '{family}' is missing in type ... but required in
 *     Record<CoinFamily, ...>"
 *        → A cysync-core Record<CoinFamily, ...> map besides the 4 above was
 *          missed. Grep for `Record<CoinFamily,` and `Record<\n  CoinFamily,` in
 *          packages/cysync-core/src/ and add a no-op entry.
 *
 *  • "Cannot find module '@cypherock/coin-support-{family}'"
 *        → You ran pnpm before this script finished, or the symlink wasn't
 *          regenerated. Re-run `pnpm install` at the repo root.
 *
 *  • "Cannot find name '{Family}AddressAndAmount'" in
 *     AddressAndAmountSection/index.tsx
 *        → The injected component declaration is missing or got placed after
 *          the anaInputMap. Open the file and confirm the
 *          `const {Family}AddressAndAmount: React.FC<AnaProps> = ...` block
 *          exists above the `const defaultAnaProps` line. If the script's
 *          regex couldn't match (heavily-edited file), declare it manually by
 *          copying any existing per-family component.
 *
 *  • "Type '{}' is not assignable" / "missing properties from type 'IPreparedXxxTransaction'"
 *        → Your operations are returning the empty stub. Once you start
 *          implementing real operations, also update src/operations/transaction.ts
 *          with the family-specific shape so the types line up.
 *
 *  • coin-support package fails to build with "Cannot find module './operations/...'"
 *        → The operations barrel re-exports every operation. If you delete a
 *          stub file, also remove it from src/operations/index.ts.
 *
 *  • App boots but every {family} operation throws "Method not implemented"
 *        → Expected. Implement operations one by one, starting with
 *          createAccounts so you can add accounts and see them, then
 *          syncAccount, then the send-side methods. Follow §4 of
 *          how-coin-support-works.md.
 *
 *  • Desktop app fails at startup with "No coin support exists for family ..."
 *        → packages/coin-support/src/index.ts wasn't patched. Check the diff
 *          and confirm the new family was added to coinSupportMap.
 *
 * ----------------------------------------------------------------------------
 *
 * Usage:
 *   node scripts/addCoinFamily.js
 *
 * What it does:
 *   1. Creates packages/coins/src/{family}/{coins,index}.ts
 *   2. Registers the family in coins/src/{types,aggregate,index}.ts
 *   3. Creates packages/coin-support-{family}/ with all operation stubs
 *   4. Registers the new package in packages/coin-support/{src/index.ts,package.json}
 *   5. Adds no-op entries to the 4 required Record<CoinFamily, ...> maps in cysync-core
 */

const readline = require('readline/promises');
const fs = require('fs/promises');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const COINS_SRC = path.join(REPO_ROOT, 'packages', 'coins', 'src');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = q => rl.question(q);
const askDefault = async (q, def) => {
  const ans = (await ask(`${q}${def !== undefined ? ` [${def}]` : ''}: `)).trim();
  return ans === '' && def !== undefined ? def : ans;
};
const askBool = async (q, def = false) => {
  const d = def ? 'Y/n' : 'y/N';
  const ans = (await ask(`${q} (${d}): `)).trim().toLowerCase();
  if (ans === '') return def;
  return ans === 'y' || ans === 'yes';
};

const cap = s => s[0].toUpperCase() + s.slice(1);

const writeFile = async (filePath, content) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content);
  console.log(`✓ ${path.relative(REPO_ROOT, filePath)}`);
};

const editFile = async (filePath, transform) => {
  const original = await fs.readFile(filePath, 'utf8');
  const updated = transform(original);
  if (updated === original) {
    console.log(`= ${path.relative(REPO_ROOT, filePath)} (already up to date)`);
    return;
  }
  await fs.writeFile(filePath, updated);
  console.log(`✓ ${path.relative(REPO_ROOT, filePath)}`);
};

// ────────────────────────────────────────────────────────────────
// Templates
// ────────────────────────────────────────────────────────────────

const tplCoinsTs = (family, coin) => `export default [
  {
    id: '${coin.id}',
    abbr: '${coin.abbr}',
    name: '${coin.name}',
    isTest: false,
    coinGeckoId: '${coin.coinGeckoId}',
    coinIndex: '${coin.coinIndex}',
    feesUnit: '${coin.feesUnit}',
    color: '${coin.color}',
    family: '${family}',
    network: '${coin.network}',
    units: [
      {
        name: '${coin.name}',
        abbr: '${coin.abbr}',
        magnitude: ${coin.magnitude},
      },
      {
        name: '${coin.subUnitName}',
        abbr: '${coin.subUnitAbbr}',
        magnitude: 0,
      },
    ],
  },
];
`;

const tplCoinsIndexTs = (family, coin) => {
  const Cap = cap(family);
  return `import coinList from './coins';

import { ICoinInfo, coinFamiliesMap } from '../types';

type ${Cap}Family = typeof coinFamiliesMap.${family};

export interface I${Cap}CoinInfo extends ICoinInfo {
  family: ${Cap}Family;
  network: string;
}

export const ${Cap}IdMap = {
  ${coin.id}: '${coin.id}',
} as const;

export type ${Cap}Id = (typeof ${Cap}IdMap)[keyof typeof ${Cap}IdMap];

export const ${family}CoinList: Record<string, I${Cap}CoinInfo> = coinList.reduce<
  Record<string, I${Cap}CoinInfo>
>(
  (list, coin) => ({
    ...list,
    [coin.id as ${Cap}Id]: {
      family: coinFamiliesMap.${family},
      id: coin.id,
      name: coin.name,
      abbr: coin.abbr,
      isTest: coin.isTest,
      coinGeckoId: coin.coinGeckoId,
      coinIndex: coin.coinIndex,
      feesUnit: coin.feesUnit,
      network: coin.network,
      units: coin.units,
      color: coin.color,
    },
  }),
  {},
);
`;
};

const tplPackageJson = family => `{
  "name": "@cypherock/coin-support-${family}",
  "version": "0.1.0",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js",
  "types": "dist/esm/index.d.ts",
  "license": "AGPL-3.0",
  "private": true,
  "scripts": {
    "lint": "eslint --ext .ts,tsx,js,jsx src/ --fix",
    "lint:check": "eslint --ext .ts,tsx,js,jsx src/",
    "pretty": "prettier --write \\"src/**/*.ts?(x)\\" \\"tests/**/*.ts?(x)\\"",
    "pretty:check": "prettier --check \\"src/**/*.ts?(x)\\" \\"tests/**/*.ts?(x)\\"",
    "build": "rimraf dist && pnpm build:esm && pnpm build:cjs",
    "build:cjs": "tsc -p tsconfig_cjs.json",
    "build:esm": "tsc -p tsconfig.json",
    "build:dirty": "pnpm build:esm",
    "test": "jest",
    "pre-commit": "lint-staged"
  },
  "devDependencies": {
    "@cypherock/eslint-config": "workspace:^",
    "@cypherock/jest-config": "workspace:^",
    "@cypherock/prettier-config": "workspace:^",
    "@cypherock/tsconfig": "workspace:^",
    "@jest/globals": "^29.5.0",
    "@types/jest": "^29.5.2",
    "@types/node": "18.15.11",
    "eslint": "^8.43.0",
    "jest": "^29.5.0",
    "lint-staged": "^13.2.2",
    "prettier": "^2.8.8",
    "rimraf": "^5.0.1",
    "ts-jest": "^29.1.0",
    "typescript": "^4.9.5"
  },
  "dependencies": {
    "@cypherock/coin-support-interfaces": "workspace:^",
    "@cypherock/coin-support-utils": "workspace:^",
    "@cypherock/coins": "workspace:^",
    "@cypherock/cysync-interfaces": "workspace:^",
    "@cypherock/cysync-utils": "workspace:^",
    "@cypherock/db-interfaces": "workspace:^",
    "rxjs": "^7.8.1"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --ext ts,tsx --quiet --fix --",
      "prettier --write"
    ],
    "*.{js,jsx,md,mdx,mjs,yml,yaml,css,json}": [
      "prettier --write"
    ]
  }
}
`;

const tplTsconfig = () => `{
  "compilerOptions": {
    "outDir": "dist/esm",
    "lib": ["DOM"]
  },
  "extends": "@cypherock/tsconfig/browser.json",
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "src/coverage",
    "src/**/__fixtures__/*.ts",
    "src/**/__tests__/*.ts",
    "src/**/__mocks__/*.ts"
  ]
}
`;

const tplTsconfigCjs = () => `{
  "compilerOptions": {
    "outDir": "dist/cjs",
    "lib": ["DOM"],
    "module": "CommonJS"
  },
  "extends": "@cypherock/tsconfig/browser.json",
  "include": ["./src/**/*"],
  "exclude": [
    "node_modules",
    "src/coverage",
    "src/**/__fixtures__/*.ts",
    "src/**/__tests__/*.ts",
    "src/**/__mocks__/*.ts"
  ]
}
`;

const tplJestConfig = () => `const baseConfig = require('@cypherock/jest-config/node');

module.exports = {
  ...baseConfig,
};
`;

const tplEslintrc = () => `module.exports = {
  root: true,
  extends: ['@cypherock/eslint-config/browser'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
};
`;

const tplGitignore = () => `.turbo
dist
coverage
`;

const tplPrettierrc = () => `"@cypherock/prettier-config"
`;

const tplTsconfigEslint = () => `{
  "compilerOptions": {
    "outDir": "dist",
    "lib": ["ES2015"]
  },
  "extends": "./tsconfig.json",
  "include": ["./src/**/*", "./tests/**/*"],
  "exclude": ["node_modules", "src/coverage"]
}
`;

const tplReadme = family => `# Coin Support ${cap(family)}

- All coin operations related to ${cap(family)}
`;

const tplConfigTs = () => `export const config = {
  API_CYSYNC: 'https://api.cypherock.com',
};
`;

const tplLoggerTs = family => `import { ILogger, LogCreator } from '@cypherock/cysync-interfaces';
import {
  createDefaultConsoleLogger,
  updateLoggerObject,
} from '@cypherock/cysync-utils';

export const loggerServiceName = 'coin-support-${family}';

const logger: ILogger = {
  ...createDefaultConsoleLogger(loggerServiceName),
};

export const updateLogger = (createLogger: LogCreator) => {
  updateLoggerObject({
    currentLogger: logger,
    newLogger: createLogger(loggerServiceName),
  });
};

export default logger;
`;

const tplAppTs = family => `// TODO: replace this stub with the real SDK app once
// @cypherock/sdk-app-${family} exists.
//
// Reference: packages/coin-support-btc/src/utils/app.ts
//
// import { ${cap(family)}App } from '@cypherock/sdk-app-${family}';
// import { IDeviceConnection } from '@cypherock/sdk-interfaces';
//
// export const createApp = (connection: IDeviceConnection) =>
//   ${cap(family)}App.create(connection);
//
// export const getAppletId = () => ${cap(family)}App.APPLET_ID;

export const createApp = () => {
  throw new Error('SDK app for ${family} is not yet wired up');
};

export const getAppletId = (): number => {
  throw new Error('SDK app for ${family} is not yet wired up');
};
`;

const tplGetCoinIdsTs = family => `import { coinFamiliesMap } from '@cypherock/coins';
import { IDatabase } from '@cypherock/db-interfaces';
import lodash from 'lodash';

export const getCoinIds = async (db: IDatabase) => {
  const accounts = await db.account.getAll({
    familyId: coinFamiliesMap.${family},
  });
  const assetList = accounts.map(account => ({
    assetId: account.assetId,
    parentAssetId: account.parentAssetId,
  }));

  return lodash.uniqWith(
    assetList,
    (a, b) => a.assetId === b.assetId && a.parentAssetId === b.parentAssetId,
  );
};
`;

const tplUtilsIndexTs = () => `export * from './app';
export * from './logger';
export * from './getCoinIds';
`;

const tplTransactionTs = () => `import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';

// TODO: extend with family-specific userInputs / staticData / computedData /
// validation flags. See .agent/docs/coin-support/how-coin-support-works.md §3
// and reference implementations in packages/coin-support-btc/src/operations/transaction.ts
// or packages/coin-support-evm/src/operations/transaction.ts.
export type IPreparedFamilyTransaction = IPreparedTransaction;
`.replace('IPreparedFamilyTransaction', '');

const tplTransactionTsReal = family => {
  const Cap = cap(family);
  return `import { IPreparedTransaction } from '@cypherock/coin-support-interfaces';

// TODO: extend with family-specific userInputs / staticData / computedData /
// validation flags. See .agent/docs/coin-support/how-coin-support-works.md §3.
export type IPrepared${Cap}Transaction = IPreparedTransaction;
`;
};

const OPERATIONS = [
  'createAccounts',
  'receive',
  'syncAccount',
  'initializeTransaction',
  'prepareTransaction',
  'signTransaction',
  'broadcastTransaction',
  'validateAddress',
  'syncPrices',
  'syncPriceHistories',
  'getCoinAllocations',
  'getAccountHistory',
  'getExplorerLink',
];

const tplOperationStub = op => `// TODO: implement ${op} for this family.
// See .agent/docs/coin-support/how-coin-support-works.md §4 for the factory
// from @cypherock/coin-support-utils and the callbacks it expects.

export const ${op} = (..._args: unknown[]): never => {
  throw new Error('${op} not implemented');
};
`;

const tplOperationsBarrel = () =>
  OPERATIONS.map(op => `export * from './${op}';`).join('\n') + '\n';

const tplOperationsTypes = () => `// TODO: define family-specific param types extending the base interfaces
// from @cypherock/coin-support-interfaces.
export {};
`;

const tplMainIndexTs = family => {
  const Cap = cap(family);
  return `/* eslint-disable class-methods-use-this */
import {
  CoinSupport,
  IBroadcastTransactionParams,
  ICreateAccountEvent,
  ICreateAccountParams,
  IFormatAddressParams,
  IGetAccountAddressParams,
  IGetAccountHistoryParams,
  IGetAccountHistoryResult,
  IGetCoinAllocationsParams,
  IGetCoinAllocationsResult,
  IGetExplorerLink,
  IInitializeTransactionParams,
  IPrepareTransactionParams,
  IPreparedTransaction,
  IReceiveEvent,
  IReceiveParams,
  ISignMessageEvent,
  ISignMessageParams,
  ISignTransactionEvent,
  ISignTransactionParams,
  ISyncAccountsParams,
  ISyncPriceHistoriesParams,
  ISyncPricesParams,
  IValidateAddressParams,
} from '@cypherock/coin-support-interfaces';
import { ITransaction } from '@cypherock/db-interfaces';
import { Observable } from 'rxjs';

import { getAppletId } from './utils';

export * from './operations/types';
export { updateLogger } from './utils/logger';

// Every method below is a stub. Replace with delegations to operations/* as
// you implement them. See packages/coin-support-xrp/src/index.ts for the
// canonical shape.
export class ${Cap}Support implements CoinSupport {
  public createAccounts(
    _params: ICreateAccountParams,
  ): Observable<ICreateAccountEvent> {
    throw new Error('Method not implemented');
  }

  public receive(_params: IReceiveParams): Observable<IReceiveEvent> {
    throw new Error('Method not implemented');
  }

  public syncAccount(_params: ISyncAccountsParams): Observable<void> {
    throw new Error('Method not implemented');
  }

  public async initializeTransaction(
    _params: IInitializeTransactionParams,
  ): Promise<IPreparedTransaction> {
    throw new Error('Method not implemented');
  }

  public async prepareTransaction(
    _params: IPrepareTransactionParams,
  ): Promise<IPreparedTransaction> {
    throw new Error('Method not implemented');
  }

  public signTransaction(
    _params: ISignTransactionParams,
  ): Observable<ISignTransactionEvent<unknown>> {
    throw new Error('Method not implemented');
  }

  public signMessage(_params: ISignMessageParams): Observable<ISignMessageEvent> {
    throw new Error('Method not implemented');
  }

  public broadcastTransaction(
    _params: IBroadcastTransactionParams<unknown>,
  ): Promise<ITransaction | undefined> {
    throw new Error('Method not implemented');
  }

  public validateAddress(_params: IValidateAddressParams): boolean {
    throw new Error('Method not implemented');
  }

  public syncPrices(_params: ISyncPricesParams): Observable<void> {
    throw new Error('Method not implemented');
  }

  public syncPriceHistories(
    _params: ISyncPriceHistoriesParams,
  ): Observable<void> {
    throw new Error('Method not implemented');
  }

  public getCoinAllocations(
    _params: IGetCoinAllocationsParams,
  ): Promise<IGetCoinAllocationsResult> {
    throw new Error('Method not implemented');
  }

  public getAccountHistory(
    _params: IGetAccountHistoryParams,
  ): Promise<IGetAccountHistoryResult> {
    throw new Error('Method not implemented');
  }

  public getExplorerLink(_params: IGetExplorerLink): string {
    throw new Error('Method not implemented');
  }

  public formatAddress(params: IFormatAddressParams): string {
    return params.address;
  }

  public async getAccountAddress(_params: IGetAccountAddressParams) {
    throw new Error('Method not implemented');
  }

  public getAppId(): number {
    return getAppletId();
  }
}
`;
};

const tplTestSkeleton = family => `import { describe, it, expect } from '@jest/globals';

import { ${cap(family)}Support } from '../src';

describe('${cap(family)}Support', () => {
  it('throws on unimplemented methods', () => {
    const support = new ${cap(family)}Support();
    expect(() => support.validateAddress({} as any)).toThrow();
  });
});
`;

// ────────────────────────────────────────────────────────────────
// File-edit helpers (with idempotency)
// ────────────────────────────────────────────────────────────────

const patchCoinFamiliesMap = (content, family) => {
  if (new RegExp(`\\b${family}\\s*:\\s*'${family}'`).test(content)) return content;
  return content.replace(
    /(coinFamiliesMap\s*=\s*{)([\s\S]*?)(}\s*as\s+const)/,
    (_, open, body, close) => {
      const trimmed = body.replace(/\s+$/, '');
      return `${open}${trimmed}\n  ${family}: '${family}',\n${close}`;
    },
  );
};

const patchAggregate = (content, family) => {
  const Cap = cap(family);
  let updated = content;

  // 1. Add import
  if (!new RegExp(`from\\s+'./${family}'`).test(updated)) {
    // Insert in alphabetical-ish order — just append before the first non-import line.
    const importLine = `import { ${family}CoinList, ${Cap}Id } from './${family}';\n`;
    const firstNonImportRe = /\n(?!import\b)/;
    const idx = updated.search(firstNonImportRe);
    if (idx === -1) {
      updated = importLine + updated;
    } else {
      updated = updated.slice(0, idx + 1) + importLine + updated.slice(idx + 1);
    }
  }

  // 2. Add to the union in `Record<...,ICoinInfo>` — append the new Id
  updated = updated.replace(
    /(export\s+const\s+coinList\s*:\s*Record<\s*)([\s\S]*?)(,\s*ICoinInfo\s*>\s*=\s*{)/,
    (m, pre, union, post) => {
      if (new RegExp(`\\b${Cap}Id\\b`).test(union)) return m;
      const cleaned = union.replace(/\s+$/, '');
      return `${pre}${cleaned}\n  | ${Cap}Id${post}`;
    },
  );

  // 3. Add to the coinList spread
  updated = updated.replace(
    /(export\s+const\s+coinList[\s\S]*?{)([\s\S]*?)(};)/,
    (m, pre, body, post) => {
      if (new RegExp(`\\.\\.\\.${family}CoinList`).test(body)) return m;
      const cleaned = body.replace(/\s+$/, '');
      return `${pre}${cleaned}\n  ...${family}CoinList,\n${post}`;
    },
  );

  // 4. Add to `CoinTypes` union
  updated = updated.replace(
    /(export\s+type\s+CoinTypes\s*=)([\s\S]*?)(;\n)/,
    (m, pre, body, post) => {
      if (new RegExp(`\\b${Cap}Id\\b`).test(body)) return m;
      const cleaned = body.replace(/\s+$/, '');
      return `${pre}${cleaned}\n  | ${Cap}Id${post}`;
    },
  );

  return updated;
};

const patchCoinsIndex = (content, family) => {
  if (new RegExp(`from\\s+'./${family}'`).test(content)) return content;
  // Add `export * from './{family}';` alphabetically after the last `export * from './xxx';`.
  const re = /export \* from '\.\/[\w-]+';/g;
  const matches = [...content.matchAll(re)];
  const lastIdx = matches.length
    ? matches[matches.length - 1].index + matches[matches.length - 1][0].length
    : 0;
  const insertion = `\nexport * from './${family}';`;
  return content.slice(0, lastIdx) + insertion + content.slice(lastIdx);
};

const patchCoinSupportIndex = (content, family) => {
  const Cap = cap(family);
  if (new RegExp(`\\b${Cap}Support\\b`).test(content)) return content;
  let updated = content;
  // Add import
  const lastImportRe = /(import[\s\S]*?from\s+'@cypherock\/coins';)/;
  updated = updated.replace(
    lastImportRe,
    match =>
      `import { ${Cap}Support } from '@cypherock/coin-support-${family}';\n${match}`,
  );
  // Add to coinSupportMap
  updated = updated.replace(
    /(coinSupportMap[^{]*{)([\s\S]*?)(};)/,
    (m, pre, body, post) => {
      const cleaned = body.replace(/\s+$/, '');
      return `${pre}${cleaned}\n  [coinFamiliesMap.${family}]: new ${Cap}Support(),\n${post}`;
    },
  );
  return updated;
};

const patchCoinSupportPackageJson = (content, family) => {
  const pkg = JSON.parse(content);
  pkg.dependencies = pkg.dependencies || {};
  if (pkg.dependencies[`@cypherock/coin-support-${family}`]) return content;
  pkg.dependencies[`@cypherock/coin-support-${family}`] = 'workspace:^';
  // Sort dependency keys for a clean diff
  pkg.dependencies = Object.fromEntries(
    Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)),
  );
  return JSON.stringify(pkg, null, 2) + '\n';
};

// cysync-core map patchers

const patchFeeInputPropsMap = (content, family) => {
  if (new RegExp(`\\b${family}\\s*:\\s*\\(\\)\\s*=>`).test(content)) return content;
  return content.replace(
    /(feeInputPropsMap[^{]*{)([\s\S]*?)(};)/,
    (m, pre, body, post) => {
      if (new RegExp(`^\\s*${family}\\s*:`, 'm').test(body)) return m;
      const cleaned = body.replace(/\s+$/, '');
      return `${pre}${cleaned}\n    ${family}: () => ({}),\n  ${post}`;
    },
  );
};

const patchComputedFeeMap = (content, family) => {
  return content.replace(
    /(const\s+computedFeeMap\s*:\s*Record<[\s\S]*?>\s*=\s*{)([\s\S]*?)(};)/,
    (m, pre, body, post) => {
      if (new RegExp(`^\\s*${family}\\s*:`, 'm').test(body)) return m;
      const cleaned = body.replace(/\s+$/, '');
      return `${pre}${cleaned}\n    ${family}: () => '0',\n  ${post}`;
    },
  );
};

const patchLabelSuffixMap = (content, family) => {
  return content.replace(
    /(const\s+labelSuffixMap\s*:\s*Record<[\s\S]*?>\s*=\s*{)([\s\S]*?)(};)/,
    (m, pre, body, post) => {
      if (new RegExp(`^\\s*${family}\\s*:`, 'm').test(body)) return m;
      const cleaned = body.replace(/\s+$/, '');
      return `${pre}${cleaned}\n    ${family}: getDefaultSuffix,\n  ${post}`;
    },
  );
};

const patchAnaInputMap = (content, family) => {
  const Cap = cap(family);
  const componentName = `${Cap}AddressAndAmount`;

  // Idempotency: if the family is already in the map, do nothing.
  const mapRe = /(const\s+anaInputMap\s*:\s*Record<[\s\S]*?>\s*=\s*{)([\s\S]*?)(};)/;
  const mapMatch = content.match(mapRe);
  if (!mapMatch) return content;
  if (new RegExp(`^\\s*${family}\\s*:`, 'm').test(mapMatch[2])) return content;

  let updated = content;

  // 1. Insert the component definition before `const defaultAnaProps`.
  const componentTpl = `const ${componentName}: React.FC<AnaProps> = ({
  disableInputs,
  providerName,
}) => (
  <Container px={5} py="12px">
    <SingleTransaction
      disableInputs={disableInputs}
      providerName={providerName}
    />
  </Container>
);

`;
  updated = updated.replace(
    /(const\s+defaultAnaProps\s*=\s*{)/,
    `${componentTpl}$1`,
  );

  // 2. Insert the `*.defaultProps = defaultAnaProps;` line right after the
  // last existing one (so it joins the contiguous block before the blank line
  // that separates it from `const anaInputMap`).
  const propsRe = /\w+\.defaultProps\s*=\s*defaultAnaProps;\n/g;
  let lastPropsEnd = -1;
  let propsMatch;
  while ((propsMatch = propsRe.exec(updated)) !== null) {
    lastPropsEnd = propsMatch.index + propsMatch[0].length;
  }
  if (lastPropsEnd !== -1) {
    updated =
      updated.slice(0, lastPropsEnd) +
      `${componentName}.defaultProps = defaultAnaProps;\n` +
      updated.slice(lastPropsEnd);
  }

  // 3. Add the family entry to the anaInputMap.
  updated = updated.replace(mapRe, (m, pre, body, post) => {
    const cleaned = body.replace(/\s+$/, '');
    return `${pre}${cleaned}\n  ${family}: ${componentName},\n${post}`;
  });

  return updated;
};

// ────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────

const main = async () => {
  console.log('\n=== Scaffold new coin family ===');
  console.log('READ THE COMMENT AT THE TOP OF scripts/addCoinFamily.js BEFORE CONTINUING.');
  console.log(
    'Reference: .agent/docs/coin-support/adding-new-coin-family-support.md\n',
  );

  const family = (await askDefault('Family name (lowercase, single word)')).trim();
  if (!/^[a-z][a-z0-9]*$/.test(family))
    throw new Error('family name must match /^[a-z][a-z0-9]*$/');

  const typesContent = await fs.readFile(path.join(COINS_SRC, 'types.ts'), 'utf8');
  if (new RegExp(`\\b${family}\\s*:`).test(typesContent)) {
    throw new Error(`Family '${family}' already registered in coinFamiliesMap.`);
  }

  console.log(`\nNow defining the family's first coin.`);
  const coin = {};
  coin.id = (await askDefault('First coin id (lowercase slug)', family)).trim();
  if (!/^[a-z][a-z0-9-]*$/.test(coin.id))
    throw new Error('coin id must match /^[a-z][a-z0-9-]*$/');
  coin.abbr = (await askDefault('Ticker / abbr', family.toUpperCase().slice(0, 4))).trim();
  coin.name = (await askDefault('Display name', cap(coin.id))).trim();
  coin.coinGeckoId = (await askDefault('CoinGecko id', coin.id)).trim();
  coin.coinIndex = (await askDefault('BIP-44 coinIndex (8 hex chars)')).trim();
  if (!/^[0-9a-f]{8}$/i.test(coin.coinIndex))
    throw new Error('coinIndex must be 8 hex characters');
  coin.feesUnit = (await askDefault('Fees unit label', coin.abbr)).trim();
  coin.color = (await askDefault('Display color (#RRGGBB)', '#FFFFFF')).trim();
  coin.network = (await askDefault('Network', 'mainnet')).trim();
  coin.magnitude = parseInt(
    (await askDefault('Native magnitude (decimals)', '18')).trim(),
    10,
  );
  coin.subUnitName = (await askDefault('Sub-unit name (e.g. wei, satoshi)', 'sub')).trim();
  coin.subUnitAbbr = (await askDefault('Sub-unit abbr', coin.subUnitName)).trim();

  console.log('\nPlanned changes:');
  console.log(`  - Create packages/coins/src/${family}/{coins,index}.ts`);
  console.log(`  - Patch packages/coins/src/{types,aggregate,index}.ts`);
  console.log(`  - Create packages/coin-support-${family}/ skeleton`);
  console.log(`  - Patch packages/coin-support/{src/index.ts,package.json}`);
  console.log(`  - Patch 4 Record<CoinFamily, ...> maps in cysync-core`);

  const ok = await askBool('\nProceed?', true);
  if (!ok) {
    console.log('Aborted.');
    rl.close();
    return;
  }

  // ── packages/coins ─────────────────────────────────────────────
  const familyDir = path.join(COINS_SRC, family);
  await writeFile(path.join(familyDir, 'coins.ts'), tplCoinsTs(family, coin));
  await writeFile(path.join(familyDir, 'index.ts'), tplCoinsIndexTs(family, coin));

  await editFile(path.join(COINS_SRC, 'types.ts'), c => patchCoinFamiliesMap(c, family));
  await editFile(path.join(COINS_SRC, 'aggregate.ts'), c => patchAggregate(c, family));
  await editFile(path.join(COINS_SRC, 'index.ts'), c => patchCoinsIndex(c, family));

  // ── packages/coin-support-{family} ────────────────────────────
  const pkgRoot = path.join(REPO_ROOT, 'packages', `coin-support-${family}`);
  await writeFile(path.join(pkgRoot, 'package.json'), tplPackageJson(family));
  await writeFile(path.join(pkgRoot, 'tsconfig.json'), tplTsconfig());
  await writeFile(path.join(pkgRoot, 'tsconfig_cjs.json'), tplTsconfigCjs());
  await writeFile(path.join(pkgRoot, 'tsconfig.eslint.json'), tplTsconfigEslint());
  await writeFile(path.join(pkgRoot, 'jest.config.js'), tplJestConfig());
  await writeFile(path.join(pkgRoot, '.eslintrc.js'), tplEslintrc());
  await writeFile(path.join(pkgRoot, '.gitignore'), tplGitignore());
  await writeFile(path.join(pkgRoot, '.prettierrc'), tplPrettierrc());
  await writeFile(path.join(pkgRoot, 'README.md'), tplReadme(family));

  await writeFile(path.join(pkgRoot, 'src', 'config.ts'), tplConfigTs());
  await writeFile(path.join(pkgRoot, 'src', 'utils', 'app.ts'), tplAppTs(family));
  await writeFile(path.join(pkgRoot, 'src', 'utils', 'logger.ts'), tplLoggerTs(family));
  await writeFile(path.join(pkgRoot, 'src', 'utils', 'getCoinIds.ts'), tplGetCoinIdsTs(family));
  await writeFile(path.join(pkgRoot, 'src', 'utils', 'index.ts'), tplUtilsIndexTs());

  await writeFile(
    path.join(pkgRoot, 'src', 'services', 'index.ts'),
    '// TODO: add axios wrappers per .agent/docs/coin-support/how-coin-support-works.md §5.2.\nexport {};\n',
  );

  for (const op of OPERATIONS) {
    await writeFile(
      path.join(pkgRoot, 'src', 'operations', op, 'index.ts'),
      tplOperationStub(op),
    );
  }
  await writeFile(path.join(pkgRoot, 'src', 'operations', 'index.ts'), tplOperationsBarrel());
  await writeFile(path.join(pkgRoot, 'src', 'operations', 'types.ts'), tplOperationsTypes());
  await writeFile(
    path.join(pkgRoot, 'src', 'operations', 'transaction.ts'),
    tplTransactionTsReal(family),
  );

  await writeFile(path.join(pkgRoot, 'src', 'index.ts'), tplMainIndexTs(family));

  await writeFile(path.join(pkgRoot, 'tests', `${family}.test.ts`), tplTestSkeleton(family));

  // ── packages/coin-support ─────────────────────────────────────
  await editFile(
    path.join(REPO_ROOT, 'packages', 'coin-support', 'src', 'index.ts'),
    c => patchCoinSupportIndex(c, family),
  );
  await editFile(
    path.join(REPO_ROOT, 'packages', 'coin-support', 'package.json'),
    c => patchCoinSupportPackageJson(c, family),
  );

  // ── cysync-core maps ──────────────────────────────────────────
  const cysyncCore = path.join(REPO_ROOT, 'packages', 'cysync-core', 'src');
  await editFile(
    path.join(cysyncCore, 'dialogs', 'Send', 'Dialogs', 'Components', 'FeeSection', 'index.tsx'),
    c => patchFeeInputPropsMap(c, family),
  );
  await editFile(
    path.join(
      cysyncCore,
      'dialogs',
      'Send',
      'Dialogs',
      'Components',
      'AddressAndAmountSection',
      'index.tsx',
    ),
    c => patchAnaInputMap(c, family),
  );
  await editFile(
    path.join(cysyncCore, 'dialogs', 'Send', 'context', 'index.tsx'),
    c => patchComputedFeeMap(c, family),
  );
  await editFile(
    path.join(cysyncCore, 'dialogs', 'Send', 'hooks', 'useLabelSuffix.ts'),
    c => patchLabelSuffixMap(c, family),
  );

  console.log('\nScaffold complete.\n');
  console.log('Next steps:');
  console.log('  1. pnpm install');
  console.log('  2. pnpm build  (expect green build; every operation throws at runtime)');
  console.log('  3. Re-read the SHORTCOMINGS block at the top of scripts/addCoinFamily.js.');
  console.log('  4. Wire up the SDK app in src/utils/app.ts once @cypherock/sdk-app-{family} exists.');
  console.log('  5. Implement operations one by one, starting with createAccounts.');
  console.log('  6. See .agent/docs/coin-support/adding-new-coin-family-support.md for the full guide.');

  rl.close();
};

main().catch(err => {
  console.error(`\nError: ${err.message}`);
  rl.close();
  process.exit(1);
});
