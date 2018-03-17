import recursiveReadDir = require("recursive-readdir");
import ErrnoException = NodeJS.ErrnoException;
import {normalize, relative} from 'path';
import {IContentReader} from "./IContentReader";
import {ContentFileCollection} from "../content/ContentFileCollection";
import {ContentFile} from "../content/ContentFile";
import {ContentFilePath} from "../content/ContentFilePath";
import {ArgumentNullError} from "../errors/ArgumentNullError";
import {stat, Stats} from "fs";
import {CommonMeta} from "../meta/CommonMeta";
import {StatsMeta} from "../meta/StatsMeta";
import {FrontmatterLoader} from "../frontmatter/FrontmatterLoader";

export class ContentReader implements IContentReader {

    public async readFiles(sourcePath: string): Promise<ContentFileCollection> {
        if (sourcePath === null) {
            throw new ArgumentNullError("path");
        }

        const collection = new ContentFileCollection(sourcePath);
        const filePaths = await recursiveReadDir(normalize(sourcePath));

        for (let filePath of filePaths) {
            const relativePath = relative(sourcePath, filePath);
            const stat = await this.statFile(filePath);
            const contentFile = new ContentFile(ContentFilePath.createFromPath(relativePath), sourcePath);
            contentFile.metadata.setItem(new StatsMeta(stat));
            contentFile.metadata.setItem(new CommonMeta(
                contentFile.relativeSourcePath.filename,
                stat.birthtime,
                stat.ctime
            ));

            collection.addFile(relativePath, contentFile);

            await FrontmatterLoader.load(collection, contentFile, relativePath);
        }

        return collection;
    }

    private async statFile(path: string): Promise<Stats> {
        return new Promise<Stats>((resolve, reject) => {
            stat(path, (err: ErrnoException, stat: Stats) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(stat);
                }
            });
        });
    }
}