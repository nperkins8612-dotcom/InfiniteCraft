import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Optional backup routes
  app.post(api.backup.save.path, async (req, res) => {
    try {
      const input = api.backup.save.input.parse(req.body);
      const saved = await storage.saveBackup(input);
      res.json({ success: true, id: saved.id });
    } catch (err) {
       res.status(400).json({ success: false });
    }
  });

  app.get(api.backup.load.path, async (req, res) => {
    const backup = await storage.getBackup(req.params.userId);
    if (!backup) {
      return res.status(404).json({ message: "No backup found" });
    }
    res.json(backup);
  });

  return httpServer;
}
