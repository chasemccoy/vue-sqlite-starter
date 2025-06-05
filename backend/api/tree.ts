import { sql } from "drizzle-orm";
import { db } from "./db";
import { type RecordSelect } from "../db/schema";

export const getFamilyTree = async (recordId: RecordSelect['id']) => {
  const family = db.get(sql`
    SELECT
      r.id,
      r.title,
      r.created_at,

      -- Parent record
      parent.id AS parent_id,
      parent.title AS parent_title,
      parent.created_at AS parent_created_at,

      -- Grandparent record
      grandparent.id AS grandparent_id,
      grandparent.title AS grandparent_title,
      grandparent.created_at AS grandparent_created_at,

      -- Sibling record
      sibling.id AS sibling_id,
      sibling.title AS sibling_title,
      sibling.created_at AS sibling_created_at,

      -- Child record
      child.id AS child_id,
      child.title AS child_title,
      child.created_at AS child_created_at,

      -- Grandchild record
      grandchild.id AS grandchild_id,
      grandchild.title AS grandchild_title,
      grandchild.created_at AS grandchild_created_at

    FROM records r

    -- === OUTGOING links to parents ===
    LEFT JOIN links l1 ON l1.source_id = r.id
    LEFT JOIN predicates p1 ON p1.id = l1.predicate_id AND p1.type = 'containment'
    LEFT JOIN records parent ON parent.id = l1.target_id

    -- === Parent's OUTGOING links to grandparents ===
    LEFT JOIN links l2 ON l2.source_id = parent.id
    LEFT JOIN predicates p2 ON p2.id = l2.predicate_id AND p2.type = 'containment'
    LEFT JOIN records grandparent ON grandparent.id = l2.target_id

    -- === Parent's INCOMING links from siblings ===
    LEFT JOIN links l3 ON l3.target_id = parent.id
    LEFT JOIN predicates p3 ON p3.id = l3.predicate_id AND p3.type = 'containment'
    LEFT JOIN records sibling ON sibling.id = l3.source_id

    -- === INCOMING links from children ===
    LEFT JOIN links l4 ON l4.target_id = r.id
    LEFT JOIN predicates p4 ON p4.id = l4.predicate_id AND p4.type = 'containment'
    LEFT JOIN records child ON child.id = l4.source_id

    -- === Child's OUTGOING links to grandchildren ===
    LEFT JOIN links l5 ON l5.source_id = child.id
    LEFT JOIN predicates p5 ON p5.id = l5.predicate_id AND p5.type = 'containment'
    LEFT JOIN records grandchild ON grandchild.id = l5.target_id

    WHERE r.id = ${recordId};
  `)

  // const family = await db.query.records.findFirst({
  //   where: (records, { eq }) => eq(records.id, recordId),
  //   columns: {
  //     id: true,
  //     title: true,
  //     recordCreatedAt: true,
  //   },
  //   with: {
  //     outgoingLinks: {
  //       where: {
  //         predicate: {
  //           type: 'containment',
  //         },
  //       },
  //       columns: {
  //         predicateId: true,
  //       },
  //       with: {
  //         target: {
  //           columns: {
  //             id: true, // Parent
  //             title: true,
  //             recordCreatedAt: true,
  //           },
  //           with: {
  //             outgoingLinks: {
  //               where: {
  //                 predicate: {
  //                   type: 'containment',
  //                 },
  //               },
  //               columns: {
  //                 predicateId: true,
  //               },
  //               with: {
  //                 target: {
  //                   columns: {
  //                     id: true, // Grandparent
  //                     title: true,
  //                     recordCreatedAt: true,
  //                   },
  //                 },
  //               },
  //             },
  //             incomingLinks: {
  //               where: {
  //                 predicate: {
  //                   type: 'containment',
  //                 },
  //               },
  //               columns: {
  //                 predicateId: true,
  //               },
  //               with: {
  //                 source: {
  //                   columns: {
  //                     id: true, // Siblings
  //                     title: true,
  //                     recordCreatedAt: true,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     incomingLinks: {
  //       where: {
  //         predicate: {
  //           type: 'containment',
  //         },
  //       },
  //       columns: {
  //         predicateId: true,
  //       },
  //       with: {
  //         source: {
  //           columns: {
  //             id: true, // Children
  //             title: true,
  //             recordCreatedAt: true,
  //           },
  //           with: {
  //             outgoingLinks: {
  //               where: {
  //                 predicate: {
  //                   type: 'containment',
  //                 },
  //               },
  //               columns: {
  //                 predicateId: true,
  //               },
  //               with: {
  //                 target: {
  //                   columns: {
  //                     id: true, // Grandchildren
  //                     title: true,
  //                     recordCreatedAt: true,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  // const family = await db.select({
  //   id: records.id,
  //   title: records.title,
  //   recordCreatedAt: records.recordCreatedAt,
  // })
  //   .from(records)
  //   .leftJoin(links, eq(links.sourceId, records.id))
  //   .leftJoin(predicates, eq(links.predicateId, predicates.id))
  //   .where(
  //     and(
  //       eq(records.id, recordId),
  //       eq(predicates.type, 'containment')
  //     )
  //   )

  return family;
}