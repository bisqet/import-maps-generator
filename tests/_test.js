import { expect, test } from "bun:test";
import {generateImportMaps} from '../generateImportMaps.js';
import * as path from "node:path";

const baseValidResult = {
  "imports": {
    "lit": "../../node_modules/lit/index.js"
  },
  "scopes": {
    "../../node_modules/": {
      "@lit/reactive-element": "../../node_modules/@lit/reactive-element/reactive-element.js",
      "lit-element/lit-element.js": "../../node_modules/lit-element/lit-element.js",
      "lit-html": "../../node_modules/lit-html/lit-html.js",
      "lit-html/is-server.js": "../../node_modules/lit-html/is-server.js"
    }
  }
}
test("Generate Import Maps for JS input", async () => {
  const testResult = await generateImportMaps({input:path.resolve(import.meta.dir, './assets/test-element.js')});
  console.log(baseValidResult, testResult)
  expect(testResult).toEqual(baseValidResult);
});
test("Generate Import Maps for HTML input", async () => {
  const testResult = await generateImportMaps({input:path.resolve(import.meta.dir, './assets/test.html'), writeToDisk:false});
  console.log(baseValidResult, testResult)
  expect(testResult).toEqual(baseValidResult);
});
test("Write generated maps", async () => {
  const validResult = await Bun.file(path.resolve(import.meta.dir, './assets/valid.html')).text();
  await generateImportMaps({input:path.resolve(import.meta.dir, './assets/test-element.js'), output:path.resolve(import.meta.dir, './assets/testResult.html')});
  const testResult = await Bun.file(path.resolve(import.meta.dir, './assets/testResult.html')).text()
  console.log(validResult, testResult)
  expect(testResult).toBe(validResult);
});
