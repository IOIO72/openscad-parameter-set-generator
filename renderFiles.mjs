import { readdir, existsSync, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';
import { exec } from 'child_process';

// Path to the output directory containing .scad files
const outputDir = join(process.cwd(), 'output');

// Path to the stl directory for rendered .stl files
const stlDir = join(process.cwd(), 'stl');

// Create stl directory if it doesn't exist
if (!existsSync(stlDir)) {
  mkdirSync(stlDir);
}

// Read the output directory
readdir(outputDir, (err, files) => {
  if (err) {
    console.error('Error reading the output directory:', err);
    return;
  }

  // Filter .scad files and render them to .stl files
  files
    .filter((file) => extname(file) === '.scad')
    .forEach((file) => {
      const scadFilePath = join(outputDir, file);
      const stlFilePath = join(stlDir, `${basename(file, '.scad')}.stl`);

      // Execute OpenSCAD CLI command to render .stl file
      exec(
        `openscad -o "${stlFilePath}" "${scadFilePath}"`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`Error rendering the file ${file}:`, err);
            return;
          }
          if (stderr) {
            console.error(`OpenSCAD error for file ${file}:`, stderr);
            return;
          }
          console.log(`File ${file} successfully rendered to ${stlFilePath}`);
        }
      );
    });
});
