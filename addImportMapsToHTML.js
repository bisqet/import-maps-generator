class HeadHandler {
  constructor(importMap = {}) {
    this.importMap = importMap
  }

  element(element) {
    const importMapTag = `<script type="importmap">
      ${JSON.stringify(this.importMap, null, 2)}
    </script>`
    element.prepend(importMapTag, {html: true})
  }
}
class ScriptHandler {
  element(element) {
    if(element.getAttribute('type') === 'importmap')element.remove()
  }
}

export const addImportMapsToHTML = async ({html, importMap, rewriteExistingMap= true, generator}) => {
  if(!HTMLRewriter){
    return generator.htmlInject(html)
  }
  const rewriter = new HTMLRewriter();
  rewriter
    .on('head', new HeadHandler(importMap))
  if(rewriteExistingMap){
    rewriter.on('script', new ScriptHandler())
  }
  return rewriter.transform(html)
}