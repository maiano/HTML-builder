const fs = require('fs').promises;
const path = require('path');

const pathIn = path.join(__dirname, 'styles');
const pathOut = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    const styles = await fs.readdir(pathIn, { withFileTypes: true });
    const stylePromises = styles.map(async (file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(pathIn, file.name);
        const fileContent = await fs.readFile(filePath, {
          encoding: 'utf8',
        });
        await fs.appendFile(pathOut, fileContent);
      }
    });

    await Promise.all(stylePromises);
    console.log('Job complete');
  } catch (err) {
    console.error('Error:', err);
  }
}

mergeStyles();
