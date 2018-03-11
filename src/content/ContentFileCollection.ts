import * as pathLib from 'path';
import ContentFile from "./ContentFile";
import ContentFilePath from "./ContentFilePath";
import ArgumentNullError from "../errors/ArgumentNullError";
import ArgumentInvalidError from "../errors/ArgumentInvalidError";

export default class ContentFileCollection {
    private _files: { [id: string]: ContentFile; };

    constructor() {
        this._files = {};
    }

    public addFile(path: ContentFilePath | string, file: ContentFile): void {
        if (!path) {
            throw new ArgumentNullError("path");
        }

        if (!file) {
            throw new ArgumentNullError("file");
        }

        if (this.hasFile(path)) {
            throw new ArgumentInvalidError("path", "Adding a file to a path that is already occupied")
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

    public eachSync(callback: (ContentFile) => void): void {
        const filePaths = Object.keys(this._files);

        for (let i = 0; i < filePaths.length; i++) {
            const file = this.getFile(filePaths[i]);

            if (file) {
                callback(file);
            }
        }
    }

    public getAllRelativeFilePaths(): string[] {
        return Object.keys(this._files);
    }

    public async eachAsync(callback: (ContentFile) => void): Promise<void> {
        const filePaths = Object.keys(this._files);

        for (let i = 0; i < filePaths.length; i++) {
            const file = this.getFile(filePaths[i]);

            if (file) {
                await callback(file);
            }
        }
    }

    private static getStringPath(path: ContentFilePath | string): string {
        return (path instanceof ContentFilePath)
            ? path.filePath
            : pathLib.normalize(path);
    }
}