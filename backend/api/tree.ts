import { db } from "./db";
import { type RecordSelect } from "../db/schema";

export const getFamilyTree = async (recordId: RecordSelect['id']) => {
  const family = await db.query.records.findFirst({
    where: {
      id: recordId,
    },
    columns: {
      id: true,
      title: true,
      recordCreatedAt: true,
    },
    with: {
      outgoingLinks: {
        where: {
          predicate: {
            type: 'containment',
          },
        },
        columns: {
          predicateId: true,
        },
        with: {
          target: {
            columns: {
              id: true, // Parent
              title: true,
              recordCreatedAt: true,
            },
            with: {
              outgoingLinks: {
                where: {
                  predicate: {
                    type: 'containment',
                  },
                },
                columns: {
                  predicateId: true,
                },
                with: {
                  target: {
                    columns: {
                      id: true, // Grandparent
                      title: true,
                      recordCreatedAt: true,
                    },
                  },
                },
              },
              incomingLinks: {
                where: {
                  predicate: {
                    type: 'containment',
                  },
                },
                columns: {
                  predicateId: true,
                },
                with: {
                  source: {
                    columns: {
                      id: true, // Siblings
                      title: true,
                      recordCreatedAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      incomingLinks: {
        where: {
          predicate: {
            type: 'containment',
          },
        },
        columns: {
          predicateId: true,
        },
        with: {
          source: {
            columns: {
              id: true, // Children
              title: true,
              recordCreatedAt: true,
            },
            with: {
              outgoingLinks: {
                where: {
                  predicate: {
                    type: 'containment',
                  },
                },
                columns: {
                  predicateId: true,
                },
                with: {
                  target: {
                    columns: {
                      id: true, // Grandchildren
                      title: true,
                      recordCreatedAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return family;
}