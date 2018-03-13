import {IContentWriter} from "./IContentWriter";
import {ContentFileCollection} from "../content/ContentFileCollection";
import {copyFile, existsSync, mkdirSync, writeFile} from "fs";
import {dirname, resolve} from "path";

export class ContentWriter implements IContentWriter {
    async writeFiles(files: ContentFileCollection, targetPath: string): Promise<void> {
        const filePaths = files.getAllRelativeFilePaths();
        for (let filePath of filePaths) {
            const file = files.getFile(filePath);

            if (file) {
                const writePath = resolve(targetPath, filePath);

                if (file.hasModifiedContent) {
                    await this.writeFile(writePath, file.getContents());
                } else {
                    await this.copyFile(resolve(files.sourcePath, file.relativeSourcePath.filePath), writePath);
                }
            }
        }
    }

    private async copyFile(from: string, to: string): Promise<void> {
        this.mkdirRecursive(dirname(to));

        await new Promise((resolve, reject) => {
            copyFile(from, to, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private async writeFile(path: string, data: Buffer): Promise<void> {
        this.mkdirRecursive(dirname(path));

        await new Promise((resolve, reject) => {
            writeFile(path, data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    }

    private mkdirRecursive(targetDir: string) {
        if (!existsSync(targetDir)) {
            this.mkdirRecursive(resolve(targetDir, ".."));
            mkdirSync(targetDir);
        }
    }
}