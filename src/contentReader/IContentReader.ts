import {ContentFileCollection} from "../content/ContentFileCollection";

export interface IContentReader {
    readFiles(path: string): Promise<ContentFileCollection>;
}