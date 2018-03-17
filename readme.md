# Typesite

Typesite is a static website generator for people who like TypeScript, inspired by [Metalsmith](http://www.metalsmith.io/).

## How to use

Here is an example code that builds a website based on the content stored in `content` to `dist`.

```typescript
import {Typesite} from 'typesite';
import {OpenGraphPrefixer} from "./src/plugins/OpenGraphPrefixer";

// Initialize
const typesite = new Typesite(
    __dirname + "/content", // Content directory 
    __dirname + "/dist" // Destination directory
);

// Register plugins
typesite.use(new OpenGraphPrefixer());

// Run it
typesite.run()
    .then(() => {
        // Completed successfully 
    })
    .catch((error) => {
        // Report the error
    });
```

## How does it work

Typesite is a very simple yet extensible framework for generating static sites. It performs three operations:

 1. Load all files from source directory
 2. Load frontmatter from the files
 3. Execute each plugin
 4. Write all the files to the target directory

### Frontmatter

Bare text files are not a powerful website-making tool, especially in Typescript's strongly typed ecosystem, and that's where front-matter comes to the resque:

```typescript
import {Frontmatter} from "typesite";
import {ProjectMeta} from "../meta/ProjectMeta";

export default new Frontmatter(
    new ProjectMeta(
        "Best game ever",
        "v0.9.8",
        "This is the best game ever and you know you're going to absolutely love it!"
    ),
    `
    # Content here
    I am writing **this** content in markdown because I have a plugin which will *compile* it later.
    `
);
```
 
All you have to do is to give your file `.ts` or `.tsx` extension and in the file `export default` an instance of `Frontmatter` class - any argument that implements `IMeta` will be loaded into that file's metadata, and you can also put one `string` or `Buffer` there to be the plaintext content.

### Plugins

The power of Typesite lies in its plugin system - you can use it to add, remove and manipulate files:

```typescript
typesite.use(new FrontmatterJsxLoader("*.tsx")); // Load JSX content and register metadata
typesite.use(new WrapInLayout("*.html"));        // Wrap files in layouts
typesite.use(new GenerateSitemap("*.html"));     // Generate sitemap
```

Plugins are executed in the order they were registered.

## Writing plugins

Any plugin you write must implement `IPlugin` and its two methods:

`getName(): string;` - Gives the name of the plugin, can be dynamic and dependent on the content, mostly useful for logging
`run(files: ContentFileCollection, typesite: Typesite): Promise<void>;` - An async method that does the actual logic of the plugin

In `run` you can interact with `ContentFileCollection` api to access the files (most specifically, `eachSync`, `eachAsync`, `removeFile` and `moveFile`). 

## Available plugins

Currently there aren't any plugins for Typesite. If you've got anything please create a github issue and I'll add it.

## Metadata

`Typesite` and each `ContentFile` have a `metadata` field which allows you to register metadata for future consumption; for example store layout information in your front-matter and use it in `WrapInLayout` plugin.

`Metadata` registers information based on the class, each class can have only a single instance of it registered and each further sets will just replace the old data.

Each file by default has two metadata registered:

 1. `StatsMeta` contains the information gathered from stating the file.
 2. `CommonMeta` contains title, creation and modification date for the file.

## Advanced features

### Custom reader/writer
You can create your own file reader or writer by implements `IContentReader` and `IContentWriter` and setting `Typesite.contentReader` and `Typesite.contentWriter`.

### Signals
There are signals that dispatch before and after all plugins run as well as before and after any plugin runs.