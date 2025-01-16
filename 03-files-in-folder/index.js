const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, getFilesInfo);

function getFilesInfo(error, files) {
  if (error) {
    console.error(error);
    return;
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(dirPath, file.name);
      const ext = path.extname(filePath);
      const fileName = path.basename(filePath, ext);

      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`${fileName} - ${ext.replace('.', '')} - ${stats.size}b`);
        }
      });
    }
  });
}
