import * as pathLibs from 'path';
import ArgumentNullError from "../errors/ArgumentNullError";
import ArgumentInvalidError from "../errors/ArgumentInvalidError";

export default class ContentFilePath {
    private _chunks: string[];

    get filePath(): string {
        return this._chunks.join(pathLibs.sep);
    }

    get directoryPath(): string {
        return this._chunks.slice(0, -1).join(pathLibs.sep);
    }

    get filename(): string {
        return this._chunks[this._chunks.length - 1];
    }

    get filenameWithoutExtension(): string {
        return this.isDotFile
            ? this.filename
            : this._chunks[this._chunks.length - 1].replace(/\.[^.]*$/, '');
    }

    get extension(): string {
        return this.isDotFile
            ? ''
            : this.filename.replace(/^[^.]+\.?/, '');
    }

    get isDotFile(): boolean {
        return this.filename.charAt(0) === ".";
    }

    constructor(chunks: string[]) {
        if (!chunks) {
            throw new ArgumentNullError("chunks");
        }

        chunks = chunks.filter(chunk => chunk);
        if (chunks.length === 0) {
            throw new ArgumentInvalidError("chunks", "Cannot be empty");
        }

        this._chunks = chunks;
    }

    public join(path: string | ContentFilePath): ContentFilePath {
        if (typeof path === "string") {
            return ContentFilePath.createFromPath(pathLibs.join(this.filePath, path));
        } else {
            return ContentFilePath.createFromPath(pathLibs.join(this.filePath, path.filePath));
        }
    }

    public get copy(): ContentFilePath {
        return new ContentFilePath(this._chunks);
    }

    public static createFromPath(path: string): ContentFilePath {
        path = path.replace(/\\/g, '/');

        return new ContentFilePath(path.split("/"));
    }

    public toString(): string {
        return `[ContentFilePath "${this.filePath}"]`;
    }
}