# Typesite

Typesite is a static website generator for people who like TypeScript, inspired by [Metalsmith](http://www.metalsmith.io/).

## How to use

Here is an example code that builds a website based on the content stored in `content` to `dist`.

```typescript
import {Typesite} from 'typesite';
import {FrontmatterJsxLoader} from "./src/plugins/FrontmatterJsxLoader";
import {OpenGraphPrefixer} from "./src/plugins/OpenGraphPrefixer";

// Initialize
const typesite = new Typesite(
    __dirname + "/content", // Content directory 
    __dirname + "/dist" // Destination directory
);

// Register plugins
typesite.use(new FrontmatterJsxLoader());
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
 2. Execute each plugin
 3. Write all the files to the target directory
 
The power lies in the plugin system - you can use it to manipulate loaded files, add new ones and remove old ones. A hypothetical example could looks like this:

```typescript
typesite.use(new FrontmatterJsxLoader("*.tsx")); // Load JSX content and register metadata
typesite.use(new WrapInLayout("*.html"));        // Wrap files in layouts
typesite.use(new GenerateSitemap("*.html"));     // Generate sitemap
```

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

## Advanced features

### Custom reader/writer
You can create your own file reader or writer by implements `IContentReader` and `IContentWriter` and setting `Typesite.contentReader` and `Typesite.contentWriter`.

### Signals
There are signals that dispatch before and after all plugins run as well as before and after any plugin runs.