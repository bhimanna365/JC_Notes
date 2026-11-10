import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectRoot = process.env.PROJECT_ROOT ? path.resolve(process.env.PROJECT_ROOT) : path.resolve(__dirname, '..', '..', '..');
export const contentRoot = process.env.CONTENT_DIR ? path.resolve(process.env.CONTENT_DIR) : path.resolve(projectRoot, 'content');
export const inventoryPath = process.env.INVENTORY_PATH ? path.resolve(process.env.INVENTORY_PATH) : path.resolve(projectRoot, 'all_pdfs_inventory.json');
