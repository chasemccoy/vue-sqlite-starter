import { eq } from "drizzle-orm";
import { db } from "./db";
import { links, type LinkSelect, type RecordSelect } from "../db/schema";

export const linksForRecord = async (recordId: RecordSelect['id']) => {
  return db.query.records.findFirst({
    columns: {
      id: true,
    },
    where: {
      id: recordId
    },
    with: {
      outgoingLinks: true,
      incomingLinks: true,
    }
  })
};

export const predicates = async () => {
  return db.query.predicates.findMany()
}

export const deleteLink = async (linkId: LinkSelect['id']) => {
  return db.delete(links).where(eq(links.id, linkId))
}