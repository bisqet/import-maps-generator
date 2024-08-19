import {addImportMapsToHTML} from './addImportMapsToHTML.js';
import {createGenerator} from "./createGenerator.js";
import path from "node:path";

/**
 * Generates import maps based on the provided input file and writes the result to the output file.
 *
 * @param {Object} options - The options for generating import maps.
 * @param {string} options.input - The path to the JS/HTML input file. If not provided, the value from the `process.env.input` environment variable is used.
 * @param {string} options.output - The path to the HTML output file. If not provided, the value from the `process.env.output` environment variable is used.
 * @param {boolean} options.rewriteExistingMap - Indicates whether to rewrite the Import Maps of the HTML output file with the generated import maps. If not provided, the value from the `process.env.rewriteExistingMap` environment variable is used. Defaults to `true`.
 * @param {boolean} options.writeToDisk - Indicates whether to write the Output to disk. If not provided, the value from the `process.env.rewriteExistingMap` environment variable is used. Defaults to `true`.
 * @return {Promise<string>} - A promise that resolves to the generated import map as a string
 */
export const generateImportMaps = async ({
                                           input = process.env.input,
                                           output = process.env.output,
                                           rewriteExistingMap = process.env.rewriteExistingMap || true,
                                           writeToDisk= process.env.writeToDisk || true
                                         } = {}) => {
  if (!input) return 'input is required';
  const filetype = path.extname(input).replace(/{html|htm}/gi, 'html');
  const isHtml = filetype === '.html';

  console.log(input,filetype);

  const generator = createGenerator(isHtml, input);

  if(isHtml){
    const inputFileText = await Bun.file(input).text();
    await generator.linkHtml(inputFileText);
  } else {
    console.log(path.basename(input))
    await generator.link(`./${path.basename(input)}`);
  }

  const importMap = generator.getMap();
  console.log(importMap)

  if (!output) return importMap;
  const outputFileContent = new Response(await Bun.file(output));
  const outputResponse = await addImportMapsToHTML({html: outputFileContent, importMap, rewriteExistingMap});
  const outputResponseText = await outputResponse.text()

  if(writeToDisk)  await Bun.write(output, outputResponseText)
  return outputResponseText;
}

if (import.meta.main) {
  const minimist = (await import('minimist')).default;
  const argv = minimist(process.argv.slice(2));
  console.log(await generateImportMaps(argv));
}