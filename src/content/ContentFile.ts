import {ContentFilePath} from "./ContentFilePath";
import {ArgumentNullError} from "../errors/ArgumentNullError";
import {Metadata} from "../meta/Metadata";
import {readFileSync} from "fs";
import {resolve} from "path";

export class ContentFile {
    private _sourcesDirectory: ContentFilePath;
    private _relativeSourcePath: ContentFilePath;
    private _modifiedContent: Buffer;
    private _hasModifiedContent: boolean;
    private _metadata: Metadata;

    public get relativeSourcePath(): ContentFilePath {
        return this._relativeSourcePath;
    }

    public get absoluteSourcePath(): ContentFilePath {
        return this._sourcesDirectory.join(this._relativeSourcePath);
    }

    public get metadata(): Metadata {
        return this._metadata;
    }

    public get hasModifiedContent(): boolean {
        return this._hasModifiedContent;
    }

    constructor(relativeFilePath: ContentFilePath | string, sourcesDirectory: ContentFilePath | string) {
        if (!relativeFilePath) {
            throw new ArgumentNullError("sourcePath");
        }

        if (sourcesDirectory === null || sourcesDirectory === undefined) {
            throw new ArgumentNullError("sourcesDirectory");
        }

        this._modifiedContent = null;
        this._hasModifiedContent = false;
        this._metadata = new Metadata();
        this._sourcesDirectory = ContentFilePath.createFromPath(resolve(typeof sourcesDirectory === "string" ? sourcesDirectory : sourcesDirectory.filePath));
        this._relativeSourcePath = typeof relativeFilePath === "string" ? ContentFilePath.createFromPath(relativeFilePath) : relativeFilePath.copy;
    }

    public getContents(): Buffer {
        return this._hasModifiedContent
            ? this._modifiedContent
            : readFileSync(this.absoluteSourcePath.filePath);
    }

    public setContents(content: Buffer | string): void {
        this._hasModifiedContent = true;
        this._modifiedContent = typeof content === "string" ? new Buffer(content) : content;
    }
}