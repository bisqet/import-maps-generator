import {Generator} from "@jspm/generator";
import {addImportMapsToHTML} from './addImportMapsToHTML.js';

/**
 * Generates import maps based on the provided input file and writes the result to the output file.
 *
 * @param {Object} options - The options for generating import maps.
 * @param {string} options.input - The path to the JS input file. If not provided, the value from the `process.env.input` environment variable is used.
 * @param {string} options.output - The path to the HTML output file. If not provided, the value from the `process.env.output` environment variable is used.
 * @param {boolean} options.rewrite - Indicates whether to rewrite the Import Maps of the HTML output file with the generated import maps. If not provided, the value from the `process.env.rewrite` environment variable is used. Defaults to `true`.
 * @return {Promise<string|undefined>} - A promise that resolves to the generated import map as a string if `output` is not provided. Otherwise, it resolves to `undefined`.
 */
export const generateImportMaps = async ({
                                           input = process.env.input,
                                           output = process.env.output,
                                           rewrite = process.env.rewrite || true
                                         } = {}) => {
  if (!input) return 'input is required';

  const generator = new Generator({
    mapUrl: import.meta.url,
    env: ['production', 'module', 'browser'],
    defaultProvider: 'nodemodules',
  });

  await generator.link(input);

  const importMap = generator.getMap();

  if (!output) return importMap;
  const outputFileContent = new Response(await Bun.file(output));
  const outputResponse = await addImportMapsToHTML({html: outputFileContent, importMap, rewrite});
  const outputResponseText = await outputResponse.text()

  await Bun.write(output, outputResponseText)
  return outputResponseText;
}

if (import.meta.main) {
  const minimist = (await import('minimist')).default;
  const argv = minimist(process.argv.slice(2));
  console.log(await generateImportMaps(argv));
}