// import { getRecord } from './records';

Bun.serve({
  routes: {
    "/record/:id": async req => {
      const { id } = req.params;
      // const record = await getRecord(id)
      return Response.json(id);
    }
  },
  port: 4321
})

// const records = await db.query.records.findMany({
//   with: {
//     outgoingLinks: true,
//     incomingLinks: true,
//   }
// });

// const links = await db.query.links.findMany({
//   with: {
//     source: true,
//     target: true,
//     predicate: true,
//   }
// });

// const predicates = await db.query.predicates.findMany({
//   with: {
//     links: true,
//     inverse: true,
//   }
// });

// const record = await getRecord(1);

// console.log(record);

// const newRecord = await upsertRecord({
//   id: 1,
//   slug: 'chase-mccoy',
//   title: 'Chase McCoy',
// })

// console.log(newRecord);

// console.log(records);
// console.log(links);
// console.log(predicates);