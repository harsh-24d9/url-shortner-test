import { uuid, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  salt: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
});

export const urlsTable = pgTable("urls", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => usersTable.id),
  shortCode: varchar({ length: 10 }).unique().notNull(),
  targetURL: text().notNull(),
  createdAt: timestamp().defaultNow(),
});
