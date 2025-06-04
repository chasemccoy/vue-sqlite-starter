import { db } from ".";
import { and, eq } from "drizzle-orm";
import { records, links, predicates } from "../db/schema";
import type { RecordSelect } from "../db/schema";

export const getFamilyTree = async (recordId: RecordSelect['id']) => {
  const family = await db.select({
    id: records.id,
    title: records.title,
    recordCreatedAt: records.recordCreatedAt,
  })
    .from(records)
    .leftJoin(links, eq(links.sourceId, records.id))
    .leftJoin(predicates, eq(links.predicateId, predicates.id))
    .where(
      and(
        eq(records.id, recordId),
        eq(predicates.type, 'containment')
      )
    )
  return family;
}