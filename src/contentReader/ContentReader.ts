import recursiveReadDir = require("recursive-readdir");
import {normalize, relative} from 'path';
import {IContentReader} from "./IContentReader";
import {ContentFileCollection} from "../content/ContentFileCollection";
import {ContentFile} from "../content/ContentFile";
import {ContentFilePath} from "../content/ContentFilePath";
import {ArgumentNullError} from "../errors/ArgumentNullError";

export class ContentReader implements IContentReader {

    public async readFiles(sourcePath: string): Promise<ContentFileCollection> {
        if (!sourcePath) {
            throw new ArgumentNullError("path");
        }

        const collection = new ContentFileCollection(sourcePath);
        const files = await recursiveReadDir(normalize(sourcePath));

        files.forEach(file => {
            const relativePath = relative(sourcePath, file);

            collection.addFile(relativePath, new ContentFile(ContentFilePath.createFromPath(relativePath), sourcePath));
        });

        return collection;
    }

}