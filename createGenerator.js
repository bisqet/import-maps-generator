import {Generator} from "@jspm/generator";
import path from "node:path";

export const createGenerator = (html=false, input) => {
  if(html) return new Generator({
    mapUrl: import.meta.url,
    env: ['production', 'module', 'browser'],
    defaultProvider: 'nodemodules',
    baseUrl : path.dirname(path.resolve(import.meta.dir, input))
  });
  return new Generator({
    mapUrl: import.meta.url,
    env: ['production', 'module', 'browser'],
    defaultProvider: 'nodemodules',
  });
}