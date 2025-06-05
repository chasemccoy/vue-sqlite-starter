import { defineRelations } from 'drizzle-orm';
import { links, predicates, records } from './records';
import { media } from './media';

export const relations = defineRelations({ media, records, links, predicates }, (r) => ({
  media: {
    record: r.one.records({
      from: r.media.recordId,
      to: r.records.id,
    }),
  },
  records: {
    outgoingLinks: r.many.links({
      from: r.records.id,
      to: r.links.sourceId,
    }),
    incomingLinks: r.many.links({
      from: r.records.id,
      to: r.links.targetId,
    }),
    media: r.many.media(),
  },
  links: {
    source: r.one.records({
      from: r.links.sourceId,
      to: r.records.id,
      optional: false,
    }),
    target: r.one.records({
      from: r.links.targetId,
      to: r.records.id,
      optional: false,
    }),
    predicate: r.one.predicates({
      from: r.links.predicateId,
      to: r.predicates.id,
      optional: false,
    }),
  },
  predicates: {
    links: r.many.links({
      from: r.predicates.id,
      to: r.links.predicateId,
    }),
    inverse: r.one.predicates({
      from: r.predicates.inverseSlug,
      to: r.predicates.slug,
    }),
  },
}))