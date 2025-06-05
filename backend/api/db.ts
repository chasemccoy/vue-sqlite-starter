import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';

const sqlite = new Database('enchiridion.db');
sqlite.pragma('journal_mode = WAL');

export const db = drizzle({ client: sqlite, schema, casing: 'snake_case' });