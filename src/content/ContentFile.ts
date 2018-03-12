import ContentFilePath from "./ContentFilePath";
import ArgumentNullError from "../errors/ArgumentNullError";

export default class ContentFile {
    private _relativeSourcePath: ContentFilePath;
    private _dynamicContent: Buffer;
    private _wasContentSet: boolean;

    public get relativeSourcePath(): ContentFilePath {
        return this._relativeSourcePath;
    }

    constructor(sourcePath: ContentFilePath | string) {
        if (!sourcePath){
            throw new ArgumentNullError("sourcePath");
        }

        this._relativeSourcePath = typeof sourcePath === "string" ? ContentFilePath.createFromPath(sourcePath) : sourcePath.copy;
    }

    public getContents(): Buffer | ContentFilePath {
        return this._wasContentSet
            ? this._dynamicContent
            : this._relativeSourcePath.copy;
    }

    public setContents(content: Buffer): void {
        this._wasContentSet = true;
        this._dynamicContent = content;
    }
}