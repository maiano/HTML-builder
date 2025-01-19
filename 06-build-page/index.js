const fs = require('fs').promises;
const path = require('path');

const pathProjectDist = path.join(__dirname, 'project-dist');
const pathAssets = path.join(__dirname, 'assets');
const pathCopyAssets = path.join(pathProjectDist, 'assets');
const pathToComponents = path.join(__dirname, 'components');
const pathToStyles = path.join(__dirname, 'styles');
const pathToStyleFile = path.join(pathProjectDist, 'style.css');
const pathTemplateFile = path.join(__dirname, 'template.html');
const pathToIndexFile = path.join(pathProjectDist, 'index.html');

async function copyDir(srcPath, destPath) {
  try {
    await fs.mkdir(destPath, { recursive: true });
    const files = await fs.readdir(srcPath, { withFileTypes: true });
    for (const file of files) {
      const src = path.join(srcPath, file.name);
      const dest = path.join(destPath, file.name);
      if (file.isFile()) {
        await fs.copyFile(src, dest);
      } else {
        await copyDir(src, dest);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function processComponents() {
  const components = {};
  const files = await fs.readdir(pathToComponents, {
    withFileTypes: true,
  });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const componentName = path.basename(file.name, '.html');
      const componentContent = await fs.readFile(
        path.join(pathToComponents, file.name),
        'utf8',
      );
      components[componentName] = componentContent;
    }
  }
  return components;
}

async function processStyles() {
  let stylesContent = '';
  const styles = await fs.readdir(pathToStyles, {
    withFileTypes: true,
  });
  for (const style of styles) {
    if (style.isFile() && path.extname(style.name) === '.css') {
      const styleContent = await fs.readFile(
        path.join(pathToStyles, style.name),
        'utf8',
      );
      stylesContent += styleContent + '\n';
    }
  }
  return stylesContent;
}

async function main() {
  try {
    await fs.mkdir(pathProjectDist, { recursive: true });

    let templateFile = await fs.readFile(pathTemplateFile, 'utf8');
    const components = await processComponents();
    for (const [componentName, componentContent] of Object.entries(
      components,
    )) {
      const placeholder = `{{${componentName}}}`;
      templateFile = templateFile.replace(placeholder, componentContent);
    }
    await fs.writeFile(pathToIndexFile, templateFile);

    const stylesContent = await processStyles();
    await fs.writeFile(pathToStyleFile, stylesContent);

    await copyDir(pathAssets, pathCopyAssets);
    console.log('Job complete');
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
