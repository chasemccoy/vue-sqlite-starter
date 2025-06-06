import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { LinkInsertSchema, links, type LinkInsert, type LinkSelect } from "../db/schema";
import { Router } from "express";
import { IdParamSchema } from "@shared/types/api";

export const linkRoutes = Router()

export const predicates = async () => {
  return db.query.predicates.findMany()
}

export const deleteLink = async (linkId: LinkSelect['id']) => {
  return db.delete(links).where(eq(links.id, linkId)).returning()
}

const upsertLink = async (link: LinkInsert) => {
  /* 1 ─ fetch predicate + inverse */
  const predicate = await db.query.predicates.findFirst({
    where: { id: link.predicateId },
    with: { inverse: true },
  });

  if (!predicate) {
    // throw new TRPCError({ code: 'NOT_FOUND', message: 'Predicate not found' });
  }

  /* 2 ─ compute canonical direction */
  let { sourceId, targetId, predicateId } = link;

  if (!predicate.canonical) {
    const inverse = predicate.inverse;

    if (!inverse?.canonical) {
      // throw new TRPCError({
      //   code: 'BAD_REQUEST',
      //   message: 'Non-canonical predicate is not reversible',
      // });
    }

    sourceId = link.targetId;
    targetId = link.sourceId;
    predicateId = inverse.id;
  }

  if (sourceId === targetId) {
    // throw new TRPCError({
    //   code: 'BAD_REQUEST',
    //   message: 'sourceId and targetId cannot be identical',
    // });
  }

  /* 3 ─ build write payload with only safe fields */
  const linkData = {
    sourceId,
    targetId,
    predicateId,
    notes: link.notes ?? null,
    recordUpdatedAt: sql`CURRENT_TIMESTAMP`.toString(),
  } satisfies Partial<LinkInsert>;

  let row: LinkSelect | undefined;

  if (link.id) {
    /* UPDATE --------------------------------------------------- */
    [row] = await db.update(links).set(linkData).where(eq(links.id, link.id)).returning();

    if (!row) {
      // throw new TRPCError({ code: 'NOT_FOUND', message: 'Link not found for update' });
    }
  } else {
    /* INSERT … ON CONFLICT ------------------------------------ */
    [row] = await db
      .insert(links)
      .values(linkData)
      .onConflictDoUpdate({
        target: [links.sourceId, links.targetId, links.predicateId],
        set: { ...linkData, recordUpdatedAt: sql`CURRENT_TIMESTAMP` },
      })
      .returning();

    if (!row) {
      // throw new TRPCError({
      //   code: 'INTERNAL_SERVER_ERROR',
      //   message: 'Failed to insert or update link',
      // });
    }
  }

  if (!row) {
    // This case should theoretically be unreachable due to checks above,
    // but included for exhaustive handling.

    // throw new TRPCError({
    //   code: 'INTERNAL_SERVER_ERROR',
    //   message: 'Failed to obtain result from upsert operation',
    // });
  }

  return row;
}

linkRoutes.get('/predicates', async (_req, res, next) => {
  try {
    res.json(await predicates());
  } catch (error) {
    next(error)
  }
})

linkRoutes.put('/link', async (req, res, next) => {
  try {
    const link = LinkInsertSchema.parse(req.body)
    const updatedLink = await upsertLink(link)
    res.json(updatedLink);
  } catch (error) {
    next(error)
  }
})

linkRoutes.delete('/link/:id', async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const deletedLink = await deleteLink(id)
    res.json(deletedLink);
  } catch (error) {
    next(error)
  }
})