import {IMeta} from "./IMeta";

export class CommonMeta implements IMeta {
    public title: string;

    public dateCreated: Date;
    public dateModified: Date;

    constructor(title: string, dateCreated: Date = null, dateModified: Date = null) {
        this.title = title;
        this.dateCreated = dateCreated;
        this.dateModified = dateModified || dateCreated;
    }

    public getKey(): string {
        return 'common';
    }
}