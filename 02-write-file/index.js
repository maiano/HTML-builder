const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const outputStream = fs.createWriteStream(filePath);

process.stdout.write('enter the text ("exit" for quit)\n');
process.stdin.on('data', (data) => {
  const input = data.toString().trim();
  input === 'exit' ? exit() : outputStream.write(input + '\n');
});
function exit() {
  process.stdout.write('bye...\n');
  process.exit();
}
