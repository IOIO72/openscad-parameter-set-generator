import { readdir, existsSync, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';
import { exec } from 'child_process';

const outputDir = join(process.cwd(), 'output');
const stlDir = join(process.cwd(), 'stl');

const createDirectoryIfNotExists = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
};

const renderScadToStl = (scadFilePath, stlFilePath) => {
  exec(
    `openscad -o "${stlFilePath}" "${scadFilePath}"`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(
          `Error rendering the file ${basename(scadFilePath)}:`,
          err
        );
        return;
      }
      if (stderr) {
        console.error(
          `OpenSCAD error for file ${basename(scadFilePath)}:`,
          stderr
        );
        return;
      }
      console.log(
        `File ${basename(scadFilePath)} successfully rendered to ${stlFilePath}`
      );
    }
  );
};

const processFiles = (err, files) => {
  if (err) {
    console.error('Error reading the output directory:', err);
    return;
  }

  files
    .filter((file) => extname(file) === '.scad')
    .forEach((file) => {
      const scadFilePath = join(outputDir, file);
      const stlFilePath = join(stlDir, `${basename(file, '.scad')}.stl`);
      renderScadToStl(scadFilePath, stlFilePath);
    });
};

createDirectoryIfNotExists(stlDir);
readdir(outputDir, processFiles);
