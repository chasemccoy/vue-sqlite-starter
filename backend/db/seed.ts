import { records, type RecordInsert } from './schema/records';
import { db } from '.';

export const recordSeed: RecordInsert[] = [
  {
    slug: 'chase-mccoy',
    title: 'Chase McCoy',
    isCurated: true,
  },
  {
    slug: 'enchiridion',
    title: 'Enchiridion',
    isCurated: true,
  },
];

await db.insert(records).values(recordSeed).returning({ id: records.id });
