import { z } from 'zod';

export const AgentConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  models: z.object({
    preferred: z.string().optional()
  }).optional(),
  skills: z.object({
    include: z.array(z.string()).default([])
  }).optional(),
  prompts: z.object({
    system: z.string().optional()
  }).optional()
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;
