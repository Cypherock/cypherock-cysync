#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop */

/**
 * Script B — Add a new coin to an existing family.
 *
 * Use this when the chain you're adding fits an existing family (e.g. a new
 * EVM L2, a Bitcoin-style fork). It does NOT create a new coin-support package;
 * it only registers metadata.
 *
 * Usage:
 *   node scripts/addCoin.js
 *
 * What it does (in order):
 *   1. Prompts for the target family (existing key in coinFamiliesMap).
 *   2. Prompts for the coin's metadata fields.
 *   3. Appends a new object to packages/coins/src/{family}/coins.ts.
 *   4. Adds the id to the family's *IdMap in packages/coins/src/{family}/index.ts.
 *   5. Optionally appends a coinToIconMap entry in CoinIcon.tsx (only if you
 *      provide an icon component name that already exists in @cypherock/cysync-ui).
 *
 * What it deliberately does NOT do:
 *   - Create the actual icon SVG (must already exist in packages/ui).
 *   - Configure the Cypherock indexer proxy / backend (coordinate separately).
 *   - Patch chain-specific operation files (only needed for unusual mechanics
 *     like Optimism-style L1 fees — refer to the docs).
 *
 * See .agent/docs/coin-support/adding-new-coin-support-to-existing-family.md
 * for the full procedure this script automates the mechanical parts of.
 */

const readline = require('readline/promises');
const fs = require('fs/promises');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const COINS_SRC = path.join(REPO_ROOT, 'packages', 'coins', 'src');
const TYPES_FILE = path.join(COINS_SRC, 'types.ts');
const COIN_ICON_FILE = path.join(
  REPO_ROOT,
  'packages',
  'cysync-core',
  'src',
  'components',
  'CoinIcon.tsx',
);

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

const readKnownFamilies = async () => {
  const types = await fs.readFile(TYPES_FILE, 'utf8');
  const block = types.match(/coinFamiliesMap\s*=\s*{([\s\S]*?)}\s*as const/);
  if (!block) throw new Error('Could not find coinFamiliesMap in coins/src/types.ts');
  const entries = [...block[1].matchAll(/^\s*([a-zA-Z_][\w]*)\s*:/gm)].map(m => m[1]);
  return entries;
};

const readKnownCoinIds = async () => {
  const ids = new Set();
  const families = await fs.readdir(COINS_SRC, { withFileTypes: true });
  for (const f of families) {
    if (!f.isDirectory()) continue;
    const coinsFile = path.join(COINS_SRC, f.name, 'coins.ts');
    try {
      const content = await fs.readFile(coinsFile, 'utf8');
      [...content.matchAll(/id:\s*['"]([\w-]+)['"]/g)].forEach(m => ids.add(m[1]));
    } catch { /* family directory may not have coins.ts */ }
  }
  return ids;
};

const indent = (str, n) => str.replace(/^/gm, ' '.repeat(n));

const renderCoinEntry = (family, fields) => {
  const lines = [];
  lines.push(`  id: '${fields.id}',`);
  lines.push(`  abbr: '${fields.abbr}',`);
  lines.push(`  name: '${fields.name}',`);
  lines.push(`  isTest: ${fields.isTest},`);
  lines.push(`  coinGeckoId: '${fields.coinGeckoId}',`);
  lines.push(`  coinIndex: '${fields.coinIndex}',`);
  lines.push(`  feesUnit: '${fields.feesUnit}',`);
  lines.push(`  color: '${fields.color}',`);
  lines.push(`  family: '${family}',`);

  // Family-specific
  if (family === 'evm') {
    lines.push(`  chain: ${fields.chain},`);
    lines.push(`  network: '${fields.network}',`);
    lines.push(`  magnitude: ${fields.magnitude ?? 18},`);
  } else if (family === 'bitcoin') {
    lines.push(`  apiCoinType: '${fields.apiCoinType}',`);
  } else {
    if (fields.network) lines.push(`  network: '${fields.network}',`);
  }

  // Units block
  const units = fields.units || [
    { name: fields.name, abbr: fields.abbr, magnitude: fields.magnitude ?? 18 },
  ];
  const unitsBlock = units
    .map(
      u =>
        `    {\n      name: '${u.name}',\n      abbr: '${u.abbr}',\n      magnitude: ${u.magnitude},\n    },`,
    )
    .join('\n');
  lines.push(`  units: [\n${unitsBlock}\n  ],`);
  if (fields.tokenList) lines.push(`  tokenList: ${fields.tokenList},`);

  return `  {\n${lines.map(l => '  ' + l.slice(2)).join('\n')}\n  },`;
};

const insertBeforeClosingArray = (content, entry) => {
  // Match the last `];` that closes the default-exported array.
  // The coins.ts files all end with `];` on its own line.
  const idx = content.lastIndexOf('];');
  if (idx === -1) throw new Error('Could not find closing `];` in coins.ts');
  const before = content.slice(0, idx).replace(/\s+$/, '');
  const after = content.slice(idx);
  return `${before}\n${entry}\n${after}`;
};

const insertIntoIdMap = (content, family, coinId) => {
  // *IdMap pattern: export const XxxIdMap = { ... } as const;
  const idMapRe =
    /(export\s+const\s+\w+IdMap\s*=\s*{)([\s\S]*?)(}\s*as\s+const\s*;)/;
  const m = content.match(idMapRe);
  if (!m) throw new Error(`Could not find *IdMap in ${family}/index.ts`);
  const [full, open, body, close] = m;
  if (new RegExp(`\\b${coinId}\\b\\s*:`).test(body)) {
    return content; // already present
  }
  const trimmed = body.replace(/\s+$/, '');
  const newBody = `${trimmed}\n  ${coinId}: '${coinId}',\n`;
  return content.replace(full, `${open}${newBody}${close}`);
};

const insertIconMapEntry = (content, family, coinId, iconName) => {
  // Find coinToIconMap and add an entry; also add the icon import to the
  // cysync-ui import block. Returns the new content (or null if the icon
  // is already present).
  const idMapImportRe = new RegExp(
    `from\\s+'@cypherock/coins'`,
    'g',
  );
  if (!idMapImportRe.test(content)) return null;

  // 1. Ensure {Family}IdMap is imported from '@cypherock/coins'.
  const familyIdMap = `${family[0].toUpperCase()}${family.slice(1)}IdMap`;
  const coinsImportRe = /(import\s+{[^}]*?)(}\s*from\s+'@cypherock\/coins'\s*;)/;
  const coinsMatch = content.match(coinsImportRe);
  let newContent = content;
  if (coinsMatch && !new RegExp(`\\b${familyIdMap}\\b`).test(coinsMatch[1])) {
    newContent = newContent.replace(
      coinsImportRe,
      `$1  ${familyIdMap},\n$2`,
    );
  }

  // 2. Ensure the icon component is imported from '@cypherock/cysync-ui'.
  const uiImportRe = /(import\s+{[^}]*?)(}\s*from\s+'@cypherock\/cysync-ui'\s*;)/;
  const uiMatch = newContent.match(uiImportRe);
  if (uiMatch && !new RegExp(`\\b${iconName}\\b`).test(uiMatch[1])) {
    newContent = newContent.replace(
      uiImportRe,
      `$1  ${iconName},\n$2`,
    );
  }

  // 3. Add to the coinToIconMap.
  const mapRe = /(const\s+coinToIconMap[^{]*{)([\s\S]*?)(}\s*as\s+Record)/;
  const mapMatch = newContent.match(mapRe);
  if (!mapMatch) return null;
  const [, open, body, close] = mapMatch;
  const key = `[${familyIdMap}.${coinId}]`;
  if (new RegExp(`\\[${familyIdMap}\\.${coinId}\\]`).test(body)) {
    return newContent; // already present
  }
  const trimmed = body.replace(/\s+$/, '');
  const newBody = `${trimmed}\n  ${key}: ${iconName},\n`;
  newContent = newContent.replace(mapMatch[0], `${open}${newBody}${close}`);
  return newContent;
};

const main = async () => {
  console.log('\n=== Add coin to existing family ===\n');
  console.log(
    'Reference: .agent/docs/coin-support/adding-new-coin-support-to-existing-family.md\n',
  );

  const families = await readKnownFamilies();
  console.log(`Existing families: ${families.join(', ')}\n`);

  const family = (await askDefault('Target family')).trim();
  if (!families.includes(family)) {
    throw new Error(
      `'${family}' is not a registered family. If you need a new family, run scripts/addCoinFamily.js instead.`,
    );
  }

  const coinsFile = path.join(COINS_SRC, family, 'coins.ts');
  const indexFile = path.join(COINS_SRC, family, 'index.ts');
  await fs.access(coinsFile);
  await fs.access(indexFile);

  const knownIds = await readKnownCoinIds();
  const id = (await askDefault('Coin id (lowercase, unique slug)')).trim();
  if (!id) throw new Error('id is required');
  if (!/^[a-z][a-z0-9-]*$/.test(id))
    throw new Error('id must be lowercase, start with a letter, and only contain [a-z0-9-]');
  if (knownIds.has(id))
    throw new Error(`Coin id '${id}' already exists somewhere in packages/coins`);

  const abbr = (await askDefault('Ticker / abbr (e.g. ETH)')).trim().toUpperCase();
  const name = (await askDefault('Display name', abbr)).trim();
  const isTest = await askBool('Is testnet?', false);
  const coinGeckoId = (await askDefault('CoinGecko id', id)).trim();
  const coinIndex = (await askDefault(
    'BIP-44 coinIndex (hex, e.g. 80000000 for BTC, 8000003c for EVM)',
  )).trim();
  if (!/^[0-9a-f]{8}$/i.test(coinIndex))
    throw new Error('coinIndex must be 8 hex characters (no 0x prefix)');
  const color = (await askDefault('Display color (#RRGGBB)', '#FFFFFF')).trim();

  const fields = { id, abbr, name, isTest, coinGeckoId, coinIndex, color };

  if (family === 'evm') {
    fields.chain = parseInt((await askDefault('EVM chain id (numeric)')).trim(), 10);
    if (Number.isNaN(fields.chain)) throw new Error('chain id must be a number');
    fields.network = (await askDefault('Network key (e.g. polygon, base)', id)).trim();
    fields.magnitude = parseInt(
      (await askDefault('Native magnitude (decimals)', '18')).trim(),
      10,
    );
    fields.feesUnit = (await askDefault('Fees unit label', 'Gwei')).trim();
    fields.units = [
      { name: 'gwei', abbr: 'Gwei', magnitude: 9 },
      { name: 'wei', abbr: 'wei', magnitude: 0 },
    ];
  } else if (family === 'bitcoin') {
    fields.apiCoinType = (await askDefault('apiCoinType (e.g. btc, ltc)', id.slice(0, 3))).trim();
    fields.feesUnit = (await askDefault('Fees unit label', 'sat/byte')).trim();
    const mag = parseInt((await askDefault('Native magnitude (decimals)', '8')).trim(), 10);
    fields.units = [
      { name, abbr, magnitude: mag },
      { name: 'satoshi', abbr: 'sat', magnitude: 0 },
    ];
    fields.tokenList = '{}';
  } else {
    fields.network = (await askDefault('Network key', 'mainnet')).trim();
    fields.feesUnit = (await askDefault('Fees unit label', abbr)).trim();
    fields.magnitude = parseInt(
      (await askDefault('Native magnitude (decimals)', '18')).trim(),
      10,
    );
  }

  // ---- write changes ----
  const entry = renderCoinEntry(family, fields);

  console.log('\nPlanned changes:');
  console.log(`  - Append to ${path.relative(REPO_ROOT, coinsFile)}`);
  console.log(`  - Add id to ${path.relative(REPO_ROOT, indexFile)} *IdMap`);

  const addIcon = await askBool(
    '\nAlso wire up a coin icon in CoinIcon.tsx (requires the icon component to already exist in @cypherock/cysync-ui)?',
    false,
  );
  let iconName = null;
  if (addIcon) {
    iconName = (await askDefault(
      'Icon component name (must be exported from @cypherock/cysync-ui)',
    )).trim();
    console.log(`  - Add ${iconName} to coinToIconMap in CoinIcon.tsx`);
  }

  const confirm = await askBool('\nProceed?', true);
  if (!confirm) {
    console.log('Aborted.');
    rl.close();
    return;
  }

  const coinsContent = await fs.readFile(coinsFile, 'utf8');
  const newCoinsContent = insertBeforeClosingArray(coinsContent, entry);
  await fs.writeFile(coinsFile, newCoinsContent);
  console.log(`✓ ${path.relative(REPO_ROOT, coinsFile)}`);

  const indexContent = await fs.readFile(indexFile, 'utf8');
  const newIndexContent = insertIntoIdMap(indexContent, family, id);
  await fs.writeFile(indexFile, newIndexContent);
  console.log(`✓ ${path.relative(REPO_ROOT, indexFile)}`);

  if (addIcon && iconName) {
    try {
      const iconContent = await fs.readFile(COIN_ICON_FILE, 'utf8');
      const newIconContent = insertIconMapEntry(iconContent, family, id, iconName);
      if (newIconContent) {
        await fs.writeFile(COIN_ICON_FILE, newIconContent);
        console.log(`✓ ${path.relative(REPO_ROOT, COIN_ICON_FILE)}`);
      } else {
        console.log(
          `⚠ Could not auto-patch CoinIcon.tsx — please add the entry manually.`,
        );
      }
    } catch (err) {
      console.log(`⚠ CoinIcon.tsx patch failed: ${err.message}`);
    }
  }

  console.log('\nNext steps:');
  console.log('  1. pnpm install');
  console.log('  2. pnpm --filter @cypherock/coins build');
  console.log('  3. pnpm --filter @cypherock/cysync-core build');
  console.log('  4. If this is an EVM L2 with unusual mechanics (L1 fee, unusual gas),');
  console.log('     review the conditionals in packages/coin-support-evm/.');
  console.log('  5. Coordinate with backend to add the indexer proxy entry for the new network.');
  console.log(
    '  6. For tokens: see .agent/docs/coin-support/adding-token-support-to-coin.md',
  );

  rl.close();
};

main().catch(err => {
  console.error(`\nError: ${err.message}`);
  rl.close();
  process.exit(1);
});
