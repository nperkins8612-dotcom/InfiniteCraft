import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// While the game is local-only, we define a schema for potential future syncing
// or just to satisfy the project structure requirements.
export const game_backups = pgTable("game_backups", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  elements: jsonb("elements").notNull(),
  combinations: jsonb("combinations").notNull(),
  tiles: jsonb("tiles").notNull(),
});

export const insertGameBackupSchema = createInsertSchema(game_backups);
export type GameBackup = typeof game_backups.$inferSelect;
export type InsertGameBackup = z.infer<typeof insertGameBackupSchema>;

// === CLIENT-SIDE TYPES (Synced with LocalStorage) ===

export const ElementSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
});
export type Element = z.infer<typeof ElementSchema>;

export const TileSchema = z.object({
  instanceId: z.string(),
  elementId: z.string(),
  x: z.number(),
  y: z.number(),
});
export type Tile = z.infer<typeof TileSchema>;

export const CombinationSchema = z.record(z.string(), z.string()); // "id1|id2" -> "resultId"
export type CombinationDictionary = z.infer<typeof CombinationSchema>;
