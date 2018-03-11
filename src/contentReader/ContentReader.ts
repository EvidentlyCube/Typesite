import IContentReader from "./IContentReader";
import ContentFileCollection from "../content/ContentFileCollection";
import {normalize, relative} from 'path';
import ContentFile from "../content/ContentFile";
import ContentFilePath from "../content/ContentFilePath";
import ArgumentNullError from "../errors/ArgumentNullError";
import recursiveReadDir = require("recursive-readdir");

export default class ContentReader implements IContentReader {

    public async readFiles(path: string): Promise<ContentFileCollection> {
        if (!path) {
            throw new ArgumentNullError("path");
        }

        const collection = new ContentFileCollection();
        const files = await recursiveReadDir(normalize(path));

        files.forEach(file => {
            const relativePath = relative(path, file);

            collection.addFile(relativePath, new ContentFile(ContentFilePath.createFromPath(relativePath)));
        });

        return collection;
    }

}