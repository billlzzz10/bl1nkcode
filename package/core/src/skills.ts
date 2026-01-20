import fs from 'fs-extra';
import path from 'path';

export async function loadCatalog(catalogPath: string = 'catalog/index.json') {
  if (!await fs.pathExists(catalogPath)) {
    return { plugins: [] };
  }
  return fs.readJson(catalogPath);
}
