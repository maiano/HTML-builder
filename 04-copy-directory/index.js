const fs = require('fs').promises;
const path = require('path');

const pathOriginDir = path.join(__dirname, 'files');
const pathCopyDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.mkdir(pathCopyDir, { recursive: true });
    const files = await fs.readdir(pathOriginDir);
    for (const file of files) {
      const src = path.join(pathOriginDir, file);
      const dest = path.join(pathCopyDir, file);
      await fs.copyFile(src, dest);
    }
    console.log('files copied');
  } catch (err) {
    console.error(err);
  }
}

copyDir();
