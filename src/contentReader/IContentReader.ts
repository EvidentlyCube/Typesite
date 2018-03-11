import ContentFileCollection from "../content/ContentFileCollection";

export default interface IContentReader {
    readFiles(path: string): Promise<ContentFileCollection>;
}