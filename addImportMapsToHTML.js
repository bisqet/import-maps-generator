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
  try {
    const rewriter = new HTMLRewriter();
    rewriter
      .on('head', new HeadHandler(importMap))
    if(rewriteExistingMap){
      rewriter.on('script', new ScriptHandler())
    }
    return rewriter.transform(html)
  } catch (error) {
    if(error.message === 'HTMLRewriter is not defined') {
      const htmlText = await html.text()
      return new Response(await generator.htmlInject(htmlText, {esModuleShims: false}))
    }
    throw new error
  }

}