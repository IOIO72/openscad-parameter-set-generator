import { readFile, existsSync, mkdirSync, writeFile } from 'fs';
import { join } from 'path';

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

// Function to read a file and return a promise
const readFileAsync = (path, encoding = 'utf8') =>
  new Promise((resolve, reject) => {
    readFile(path, encoding, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

// Function to write a file and return a promise
const writeFileAsync = (path, data) =>
  new Promise((resolve, reject) => {
    writeFile(path, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

// Function to create output directory if it doesn't exist
const createOutputDir = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
};

// Function to replace parameters in the template
const replaceParameters = (templateLines, parameters) =>
  templateLines
    .map((line) => {
      for (const [key, value] of Object.entries(parameters)) {
        if (line.startsWith(`${key} = `)) {
          const regex = new RegExp(`^${key} = (".*?"|.*?);`);
          return line.replace(regex, (match, p1) =>
            p1.startsWith('"') && p1.endsWith('"')
              ? `${key} = "${value}";`
              : `${key} = ${value};`
          );
        }
      }
      return line;
    })
    .join('\n');

// Main function to create parameter set files
const createParameterSetFiles = async () => {
  try {
    const jsonData = JSON.parse(await readFileAsync(jsonFilePath));
    const parameterSets = jsonData.parameterSets;
    const templateData = await readFileAsync(templateFilePath);
    const templateLines = templateData.split('\n');
    const outputDir = join(process.cwd(), 'output');

    createOutputDir(outputDir);

    for (const [key, value] of Object.entries(parameterSets)) {
      const filePath = join(outputDir, `${key}.scad`);
      const fileContent = replaceParameters(templateLines, value);

      try {
        await writeFileAsync(filePath, fileContent);
        console.log(`File ${key}.scad successfully created.`);
      } catch (err) {
        console.error(`Error writing the file ${key}.scad:`, err);
      }
    }
  } catch (err) {
    console.error('Error processing files:', err);
  }
};

// Execute the main function
createParameterSetFiles();
