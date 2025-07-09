import 'dotenv/config';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';
import { relations } from '../db/schema/relations';

const sqlite = new Database(`${process.env.DATABASE_NAME}.db`);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle({
  client: sqlite,
  schema,
  relations,
  casing: 'snake_case',
});

export type Db = typeof db;
