import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: ['src/entity/*.ts'],
  migrations: [],
  subscribers: [],
});
