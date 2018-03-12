import ContentFileCollection from "../content/ContentFileCollection";

export default interface IContentWriter {
    writeFiles(files:ContentFileCollection, path: string): Promise<void>;
}