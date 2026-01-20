import fs from 'fs-extra';
import path from 'path';
// @ts-ignore
import * as toml from 'smol-toml';
import { AgentConfigSchema, type AgentConfig } from './schemas/agent-config.js';

export async function loadAgentPersona(personaName: string, personasDir: string = 'agent-personas'): Promise<AgentConfig> {
  const personaPath = path.join(personasDir, `${personaName}.toml`);
  
  if (!await fs.pathExists(personaPath)) {
    throw new Error(`Agent persona not found: ${personaName} at ${personaPath}`);
  }

  const content = await fs.readFile(personaPath, 'utf-8');
  const parsed = toml.parse(content);
  
  return AgentConfigSchema.parse(parsed);
}

export async function listAgentPersonas(personasDir: string = 'agent-personas'): Promise<string[]> {
  if (!await fs.pathExists(personasDir)) {
    return [];
  }
  
  const files = await fs.readdir(personasDir);
  return files
    .filter(f => f.endsWith('.toml'))
    .map(f => f.replace('.toml', ''));
}
