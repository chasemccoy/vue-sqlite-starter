import { db } from "./db";
import { type RecordSelect } from "../db/schema";
import { Router } from "express";
import { IdParamSchema } from "@shared/types/api";

export const treeRoutes = Router()

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

treeRoutes.get('/tree/:id', async (req, res, next) => {
  try {
    const { id } = IdParamSchema.parse(req.params);
    const tree = await getFamilyTree(id)
    res.json(tree);
  } catch (error) {
    next(error)
  }
})