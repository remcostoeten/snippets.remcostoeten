import { db } from "@/server/db";
import { eq, asc, desc, SQL } from "drizzle-orm";

type Order = "Asc" | "Desc";
type Quantity = "One" | "All";

type SchemaRow<T> = T extends { $inferSelect: infer R } ? R : never;
type SchemaColumn<T> = keyof SchemaRow<T>;

export function CrudAbstractions<TSchema>(schema: TSchema) {
  type Row = SchemaRow<TSchema>;
  type Column = keyof Row;

  return {
    // --- CREATE ---
    create: () => ({
      run: async (values: Partial<Row>) => {
        const result = await db.insert(schema).values(values).returning();
        return result[0];
      },
    }),

    // --- READ ---
    get: (quantity: Quantity = "All") => {
      let filters: SQL[] = [];
      let orderBy: { column: Column; dir: Order } | null = {
        column: "id" as Column, // default sort by id
        dir: "Asc",
      };
      let limit: number | null = null;

      const api = {
        Where: <K extends Column>(col: K, val: Row[K]) => {
          filters.push(eq((schema as any)[col], val));
          return api;
        },
        Order: (col: Column, dir: Order) => {
          orderBy = { column: col, dir };
          return api;
        },
        Limit: (n: number) => {
          limit = n;
          return api;
        },
        run: async (): Promise<any> => {
          let query = db.select().from(schema);

          if (filters.length) {
            query = query.where(filters.reduce((a, b) => (a as any).and(b)));
          }
          if (orderBy) {
            query = query.orderBy(
              orderBy.dir === "Asc"
                ? asc((schema as any)[orderBy.column])
                : desc((schema as any)[orderBy.column])
            );
          }
          if (limit) {
            query = query.limit(limit);
          }

          const results = await query;
          return quantity === "One"
            ? (results[0] as Row | undefined)
            : (results as Row[]);
        },
      };

      return api;
    },

    // --- UPDATE ---
    update: () => {
      let filter: { col: Column; val: any } | null = null;
      let data: Partial<Row> = {};

      const api = {
        Where: <K extends Column>(col: K, val: Row[K]) => {
          filter = { col, val };
          return api;
        },
        Set: (values: Partial<Row>) => {
          data = values;
          return api;
        },
        run: async () => {
          if (!filter) throw new Error("Update requires a Where clause");
          return await db
            .update(schema)
            .set(data)
            .where(eq((schema as any)[filter.col], filter.val))
            .returning();
        },
      };

      return api;
    },

    // --- DELETE ---
    destroy: () => {
      let filter: { col: Column; val: any } | null = null;

      const api = {
        Where: <K extends Column>(col: K, val: Row[K]) => {
          filter = { col, val };
          return api;
        },
        run: async () => {
          if (!filter) throw new Error("Delete requires a Where clause");
          return await db
            .delete(schema)
            .where(eq((schema as any)[filter.col], filter.val))
            .returning();
        },
      };

      return api;
    },
  };
}
