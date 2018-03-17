import * as pathLib from 'path';
import {isAbsolute, normalize, resolve} from 'path';
import {ContentFile} from "./ContentFile";
import {ContentFilePath} from "./ContentFilePath";
import {ArgumentNullError} from "../errors/ArgumentNullError";
import {ArgumentInvalidError} from "../errors/ArgumentInvalidError";

export class ContentFileCollection {
    private _files: { [id: string]: ContentFile; };
    private _sourcePath: string;

    public get sourcePath(): string {
        return this._sourcePath;
    }

    constructor(sourcePath: string = "") {
        this._files = {};
        this._sourcePath = isAbsolute(sourcePath) ? normalize(sourcePath) : resolve(sourcePath);
    }

    public addFile(path: ContentFilePath | string, file: ContentFile): void {
        if (!path) {
            throw new ArgumentNullError("path");
        }

        if (!file) {
            throw new ArgumentNullError("file");
        }

        if (this.hasFile(path)) {
            throw new ArgumentInvalidError("path", "Adding a file to a path that is already occupied");
        }

        this._files[ContentFileCollection.getStringPath(path)] = file;
    }

    public moveFile(from: ContentFilePath | string, to: ContentFilePath | string): void {
        if (!from) {
            throw new ArgumentNullError("from");
        }
        if (!to) {
            throw new ArgumentNullError("to");
        }

        from = ContentFileCollection.getStringPath(from);
        to = ContentFileCollection.getStringPath(to);

        if (!this.hasFile(from)) {
            throw new ArgumentInvalidError("from", "Trying to move file that does not exist");
        }

        if (this.hasFile(to)) {
            throw new ArgumentInvalidError("to", "Trying to move a file to an already existing file");
        }

        this._files[to] = this._files[from];
        delete(this._files[from]);
    }

    public hasFile(path: ContentFilePath | string): boolean {
        if (!path) {
            throw new ArgumentNullError("path");
        }

        return this._files.hasOwnProperty(ContentFileCollection.getStringPath(path));
    }

    public removeFile(path: ContentFilePath | string): void {
        if (!path) {
            throw new ArgumentNullError("path");
        }

        delete(this._files[ContentFileCollection.getStringPath(path)]);
    }

    public getFile(path: ContentFilePath | string): ContentFile {
        if (!path) {
            throw new ArgumentNullError("path");
        }

        return this.hasFile(path)
            ? this._files[ContentFileCollection.getStringPath(path)]
            : null;
    }

    public eachSync(callback: (file: ContentFile, path: string) => void): void {
        const filePaths = Object.keys(this._files);

        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            const file = this.getFile(filePath);

            if (file) {
                callback(file, filePath);
            }
        }
    }

    public getAllRelativeFilePaths(): string[] {
        return Object.keys(this._files);
    }

    public async eachAsync(callback: (file: ContentFile, path: string) => void): Promise<void> {
        const filePaths = Object.keys(this._files);

        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            const file = this.getFile(filePath);

            if (file) {
                await callback(file, filePath);
            }
        }
    }

    private static getStringPath(path: ContentFilePath | string): string {
        return (path instanceof ContentFilePath)
            ? path.filePath
            : pathLib.normalize(path);
    }
}