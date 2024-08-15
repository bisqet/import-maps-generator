# Import Maps Generator

Generate import maps to achieve true buildless development. Uses `@jspm/generator` under the hood. Built on `Bun` and uses `HTMLRewriter` for the best performance
## Usage
It needs js input file and provides html output based on output file
```bash
bun generateImportMaps.js --input=./tests/assets/test-element.js --output=./tests/assets/test.html
```
Or
```js
import {generateImportMaps} from 'import-maps-generator'

await generateImportMaps({input:'./tests/assets/test-element.js', output:'./tests/assets/test.html'})
```
Output:
```html
<!DOCTYPE html>
<html lang="en">
<head><script type="importmap">
  {
"imports": {
"lit": "./node_modules/lit/index.js"
},
"scopes": {
"./node_modules/": {
  "@lit/reactive-element": "./node_modules/@lit/reactive-element/reactive-element.js",
  "lit-element/lit-element.js": "./node_modules/lit-element/lit-element.js",
  "lit-html": "./node_modules/lit-html/lit-html.js",
  "lit-html/is-server.js": "./node_modules/lit-html/is-server.js"
}
}
}
</script>
  <meta charset="UTF-8">
  <title>test</title>
  <script type="module" src="test-element.js"></script>
</head>
<body>
<test-element></test-element>
</body>
</html>
```
## API:
```js
/**
 * Generates import maps based on the provided input file and writes the result to the output file.
 *
 * @param {Object} options - The options for generating import maps.
 * @param {string} options.input - The path to the JS input file. If not provided, the value from the `process.env.input` environment variable is used.
 * @param {string} options.output - The path to the HTML output file. If not provided, the value from the `process.env.output` environment variable is used.
 * @param {boolean} options.rewrite - Indicates whether to rewrite the Import Maps of the HTML output file with the generated import maps. If not provided, the value from the `process.env.rewrite` environment variable is used. Defaults to `true`.
 * @return {Promise<string|undefined>} - A promise that resolves to the generated import map as a string if `output` is not provided. Otherwise, it resolves to `undefined`.
 */
```

## TODO:
- [ ] allow html file as input like in @jspm/generator
- [ ] pass custom arguments to @jspm generator
- [ ] test it on Node.js

## Why it exists?
I had problems with lit on bun+elysia. The classic 
```
TypeError: Failed to resolve module specifier "lit". Relative references must start with either "/", "./", or "../".
```
I tried to find something like `koa-node-resolve` but for `Elysia.js` and not found such a thing. So I decided to generate [import maps](https://github.com/WICG/import-maps).

I tried JSPM CLI(and Bun version not worked well, so I used it from node), and found out that since I used custom routing for my project I cannot use CLI. So I used @jspm/generator which cannot write to html file as JSPM CLI does.

This project solves problems I had:
- [ ] It allowed me to use custom routing and still generate correct Import Maps
- [ ] It built on Bun and I had no problems launching it from CLI