import { readFile, existsSync, mkdirSync, writeFile } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Path to the current file and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command-line arguments
const args = process.argv.slice(2);

// Check if both arguments are provided
if (args.length < 2) {
  console.error(
    'Usage: node createParameterSetFiles.mjs <path_to_scad_file> <path_to_json_file>'
  );
  process.exit(1);
}

// Paths to the SCAD and JSON files
const [templateFilePath, jsonFilePath] = args;

// Read the JSON file
readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the JSON file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);
    const parameterSets = jsonData.parameterSets;

    // Read the template file
    readFile(templateFilePath, 'utf8', (err, templateData) => {
      if (err) {
        console.error('Error reading the template file:', err);
        return;
      }

      // Create directory for output files
      const outputDir = join(__dirname, 'output');
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir);
      }

      // Create an OpenSCAD file for each sub-object in parameterSets
      for (const [key, value] of Object.entries(parameterSets)) {
        const filePath = join(outputDir, `${key}.scad`);
        let fileContent = templateData;

        // Replace the constant values in the template with the values from the JSON sub-object
        for (const [k, v] of Object.entries(value)) {
          const regex = new RegExp(`${k} = .*;`, 'g');
          fileContent = fileContent.replace(regex, `${k} = ${v};`);
        }

        writeFile(filePath, fileContent, (err) => {
          if (err) {
            console.error(`Error writing the file ${key}.scad:`, err);
          } else {
            console.log(`File ${key}.scad successfully created.`);
          }
        });
      }
    });
  } catch (err) {
    console.error('Error parsing the JSON data:', err);
  }
});
