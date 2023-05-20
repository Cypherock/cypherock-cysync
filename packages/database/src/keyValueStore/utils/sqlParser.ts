import { Database } from 'better-sqlite3';

const table = {
  name: 'storage',
  keyColumn: 'key',
  valueColumn: 'value',
} as const;

export function createTable(db: Database) {
  const statement = `CREATE TABLE IF NOT EXISTS \`${table.name}\` (${table.keyColumn} TEXT PRIMARY KEY, ${table.valueColumn} TEXT NOT NULL)`;

  db.prepare(statement).run();
}
export function insertPair(db: Database, key: string, value: string) {
  const statement = `INSERT OR REPLACE INTO \`${table.name}\` (${table.keyColumn}, ${table.valueColumn}) VALUES (?, ?)`;

  const { changes } = db.prepare(statement).run(key, value);
  return changes;
}
export function getValue(db: Database, key: string): string | null {
  const statement = `SELECT value FROM \`storage\` WHERE key LIKE ?`;

  const result = db.prepare(statement).all(key)[0] as any;
  return result ? result[table.valueColumn] ?? null : null;
}

export function removePair(db: Database, key: string) {
  const statement = `DELETE FROM \`${table.name}\` WHERE ${table.keyColumn} LIKE ?`;

  const { changes } = db.prepare(statement).run(key);
  return changes;
}

export function truncateTable(db: Database) {
  const statement = `DELETE FROM \`${table.name}\``;

  const { changes } = db.prepare(statement).run();
  return changes;
}

export function countTableRows(db: Database) {
  const param = 'COUNT(*)';
  const statement = `SELECT ${param} FROM \`${table.name}\``;

  const count = db.prepare(statement).all()[0] as any;
  return count ? count[param] ?? 0 : 0;
}

export function getNthKey(db: Database, n: number) {
  const statement = `SELECT ${table.keyColumn} FROM \`${table.name}\` LIMIT 1 OFFSET ?`;

  const key = db.prepare(statement).all(n)[0] as any;
  return key ? key[table.keyColumn] ?? null : null;
}
