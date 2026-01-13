import { db } from "./db";
import {
  game_backups,
  type InsertGameBackup,
  type GameBackup
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Minimal storage interface - game is mostly local
  saveBackup(backup: InsertGameBackup): Promise<GameBackup>;
  getBackup(userId: string): Promise<GameBackup | undefined>;
}

export class DatabaseStorage implements IStorage {
  async saveBackup(backup: InsertGameBackup): Promise<GameBackup> {
    const [saved] = await db.insert(game_backups).values(backup).returning();
    return saved;
  }

  async getBackup(userId: string): Promise<GameBackup | undefined> {
    const [backup] = await db
      .select()
      .from(game_backups)
      .where(eq(game_backups.userId, userId))
      .limit(1);
    return backup;
  }
}

export const storage = new DatabaseStorage();
