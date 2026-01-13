import { z } from 'zod';
import { insertGameBackupSchema } from './schema';

export const errorSchemas = {
  internal: z.object({ message: z.string() }),
};

export const api = {
  // Optional backup endpoint if we wanted to sync to server
  backup: {
    save: {
        method: 'POST' as const,
        path: '/api/backup',
        input: insertGameBackupSchema,
        responses: { 200: z.object({ success: z.boolean() }) }
    },
    load: {
        method: 'GET' as const,
        path: '/api/backup/:userId',
        responses: { 
            200: insertGameBackupSchema,
            404: z.object({ message: z.string() }) 
        }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
