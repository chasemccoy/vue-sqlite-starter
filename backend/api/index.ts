import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../db/schema';
import { getRecord } from './records';

const sqlite = new Database('enchiridion.db');
sqlite.pragma('journal_mode = WAL');

export const db = drizzle({ client: sqlite, schema, casing: 'snake_case' });

const records = await db.query.records.findMany({
  with: {
    outgoingLinks: true,
    incomingLinks: true,
  }
});

const links = await db.query.links.findMany({
  with: {
    source: true,
    target: true,
    predicate: true,
  }
});

const predicates = await db.query.predicates.findMany({
  with: {
    links: true,
    inverse: true,
  }
});

const record = await getRecord(1);

console.log(record);

// const newRecord = await upsertRecord({
//   id: 1,
//   slug: 'chase-mccoy',
//   title: 'Chase McCoy',
// })

// console.log(newRecord);

// console.log(records);
// console.log(links);
// console.log(predicates);