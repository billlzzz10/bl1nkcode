import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// โฟลเดอร์ที่จะไม่แสดง
const IGNORE_LIST = [
  'node_modules', 
  '.git', 
  '.next', 
  '.vscode', 
  '.idea',
  'coverage',
  'dist'
];

function printTree(dir, prefix = '') {
  // อ่านไฟล์และเรียงลำดับ
  let items;
  try {
    items = fs.readdirSync(dir).sort((a, b) => {
      const aPath = path.join(dir, a);
      const bPath = path.join(dir, b);
      // เช็คว่าเป็น folder หรือไม่ (ใส่ try catch เผื่อ permission error)
      let aIsDir = false, bIsDir = false;
      try { aIsDir = fs.statSync(aPath).isDirectory(); } catch(e) {}
      try { bIsDir = fs.statSync(bPath).isDirectory(); } catch(e) {}
      
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });
  } catch (e) {
    return; // อ่าน folder ไม่ได้ให้ข้าม
  }

  const filteredItems = items.filter(item => !IGNORE_LIST.includes(item));

  filteredItems.forEach((item, index) => {
    const isLast = index === filteredItems.length - 1;
    const fullPath = path.join(dir, item);
    let stats;
    try { stats = fs.statSync(fullPath); } catch(e) { return; }

    console.log(`${prefix}${isLast ? '└── ' : '├── '}${item}`);

    if (stats.isDirectory()) {
      printTree(fullPath, `${prefix}${isLast ? '    ' : '│   '}`);
    }
  });
}

console.log(`\n📂 Project Structure: ${path.basename(process.cwd())}`);
console.log('='.repeat(30));
printTree(process.cwd());
console.log('='.repeat(30) + '\n');