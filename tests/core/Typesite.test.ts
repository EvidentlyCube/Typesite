import {expect} from 'chai';
import 'mocha';
import {ContentFileCollection, IContentReader, IContentWriter, IPlugin, Typesite} from "../../src";

describe('Typesite', () => {
    const sourcePath = "this/is/source/path";
    const targetPath = "this/is/target/path";

    it("Should test run executes everything in the correct order", async () => {
        const log: any[] = [];

        const files = new ContentFileCollection();
        const typesite = new Typesite(sourcePath, targetPath);
        typesite.contentReader = new test_ContentReader((path) => {
            log.push(['reader', path]);
            return files;
        });

        typesite.contentWriter = new test_ContentWriter((string, files) => {
            log.push(['writer', string, files]);
        });

        typesite.use(new test_Plugin("Test1", (plugin, files, typesite) => {
            log.push(['plugin', plugin.getName(), files, typesite]);
        }));

        typesite.use(new test_Plugin("Test2", (plugin, files, typesite) => {
            log.push(['plugin', plugin.getName(), files, typesite]);
        }));

        typesite.onBeforeAllPlugins.add((files) => {
            log.push(['beforePlugins', files]);
        });

        typesite.onBeforePlugin.add((plugin) => {
            log.push(['beforePlugin', plugin.getName()]);
        });

        typesite.onAfterPlugin.add((plugin) => {
            log.push(['afterPlugin', plugin.getName()]);
        });

        typesite.onAfterAllPlugins.add((files) => {
            log.push(['afterPlugins', files]);
        });

        await typesite.run();
        expect(log).to.have.deep.ordered.members([
            ["reader", sourcePath],
            ["beforePlugins", files],
            ["beforePlugin", "Test1"],
            ["plugin", "Test1", files, typesite],
            ["afterPlugin", "Test1"],
            ["beforePlugin", "Test2"],
            ["plugin", "Test2", files, typesite],
            ["afterPlugin", "Test2"],
            ["afterPlugins", files],
            ["writer", targetPath, files]
        ]);
    });
});


class test_ContentReader implements IContentReader {
    private _callback: (path: string) => ContentFileCollection;

    constructor(callback: (path: string) => ContentFileCollection) {
        this._callback = callback;
    }

    async readFiles(path: string): Promise<ContentFileCollection> {
        return this._callback(path);
    }
}

class test_ContentWriter implements IContentWriter {
    private _callback: (path: string, files: ContentFileCollection) => void;

    constructor(callback: (path: string, files: ContentFileCollection) => void) {
        this._callback = callback;
    }

    writeFiles(files: ContentFileCollection, path: string): Promise<void> {
        this._callback(path, files);

        return null;
    }
}

class test_Plugin implements IPlugin {
    private _name: string;
    private _callback: (plugin: IPlugin, files: ContentFileCollection, typesite: Typesite) => void;

    constructor(name: string, callback: (plugin: IPlugin, files: ContentFileCollection, typesite: Typesite) => void) {
        this._name = name;
        this._callback = callback;
    }

    getName(): string {
        return this._name;
    }

    async run(files: ContentFileCollection, typesite: Typesite): Promise<void> {
        this._callback(this, files, typesite);
    }
}