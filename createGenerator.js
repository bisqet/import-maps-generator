import {Generator} from "@jspm/generator";
import path from "node:path";
import * as url from "node:url";

export const createGenerator = (html=false, input, mapUrl) => {
  const inputUrl = url.pathToFileURL(path.dirname(input)+'/');
  console.log(inputUrl);
  if(html) return new Generator({
    mapUrl: inputUrl,
    env: ['production', 'module', 'browser'],
    defaultProvider: 'nodemodules',
    baseUrl : inputUrl
  });
  return new Generator({
    mapUrl: inputUrl,
    env: ['production', 'module', 'browser'],
    defaultProvider: 'nodemodules',
  });
}