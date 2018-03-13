import {ContentFileCollection} from "../content/ContentFileCollection";

export interface IContentWriter {
    writeFiles(files: ContentFileCollection, path: string): Promise<void>;
}