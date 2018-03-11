# Typesite

Typesite is a static website generator for people who like TypeScript, inspired by [Metalsmith](http://www.metalsmith.io/).

*Currently it's still in the development and as of now is not yet usable.*

## Workflow

 1. `source` directory is read and a file index is built
 2. Files which end with `.dyn.ts` and `.dyn.js` are automatically imported and, depending on what they export, can provide additional information to be later used by plugins; the same happens with files. The behavior can be customized.
 3. Then plugins are run and they can do anything: add archive pages, generate thumbs, prepare sitemap, wrap your pages in predefined layouts and more!
 4. Finally, all of the files are written to the `target` directory.