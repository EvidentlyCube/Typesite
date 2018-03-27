import {Signal} from "signals";
import {IContentReader} from "../contentReader/IContentReader";
import {IContentWriter} from "../contentWriter/IContentWriter";
import {ArgumentNullError} from "../errors/ArgumentNullError";
import {ContentReader} from "../contentReader/ContentReader";
import {ContentWriter} from "../contentWriter/ContentWriter";
import {IPlugin} from "./IPlugin";
import {Metadata} from "../meta/Metadata";
import {FileIterationError} from "../errors/FileIterationError";
import {PluginError} from "../errors/PluginError";

/**
 * Ducks and rucks
 */
export class Typesite {
    private _contentReader: IContentReader;
    private _contentWriter: IContentWriter;
    private _sourcePath: string;
    private _targetPath: string;

    private _onBeforeAllPlugins: Signal;
    private _onAfterAllPlugins: Signal;

    private _onBeforePlugin: Signal;
    private _onAfterPlugin: Signal;

    private _plugins: IPlugin[];
    private _metadata: Metadata;

    public set contentReader(reader: IContentReader) {
        if (!reader) {
            throw new ArgumentNullError('reader');
        }

        this._contentReader = reader;
    }

    public set contentWriter(writer: IContentWriter) {
        if (!writer) {
            throw new ArgumentNullError('writer');
        }

        this._contentWriter = writer;
    }

    public get onBeforeAllPlugins(): Signal {
        return this._onBeforeAllPlugins;
    }

    public get onAfterAllPlugins(): Signal {
        return this._onAfterAllPlugins;
    }

    public get onBeforePlugin(): Signal {
        return this._onBeforePlugin;
    }

    public get onAfterPlugin(): Signal {
        return this._onAfterPlugin;
    }

    public get metadata(): Metadata {
        return this._metadata;
    }

    constructor(sourcePath: string, targetPath: string) {
        this._contentReader = new ContentReader();
        this._contentWriter = new ContentWriter();
        this._metadata = new Metadata();

        this._sourcePath = sourcePath;
        this._targetPath = targetPath;

        this._plugins = [];
        this._onBeforeAllPlugins = new Signal();
        this._onAfterAllPlugins = new Signal();
        this._onBeforePlugin = new Signal();
        this._onAfterPlugin = new Signal();
    }

    public use(plugin: IPlugin): void {
        this._plugins.push(plugin);
    }

    public async run(): Promise<void> {
        const files = await this._contentReader.readFiles(this._sourcePath);

        this._onBeforeAllPlugins.dispatch(files);
        for (let plugin of this._plugins) {
            this._onBeforePlugin.dispatch(plugin);
            try {
                await plugin.run(files, this);
            } catch (error) {
                if (error instanceof FileIterationError){
                    throw new PluginError(plugin, error.filePath, error.innerError);
                } else {
                    throw new PluginError(plugin, null, error);
                }
            }
            this.onAfterPlugin.dispatch(plugin);
        }
        this._onAfterAllPlugins.dispatch(files);

        await this._contentWriter.writeFiles(files, this._targetPath);
    }
}