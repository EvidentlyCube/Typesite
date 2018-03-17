export class DuplicateMetadataError extends Error {
    private _metadataKeyName: string;

    public get metadataKeyName(): string {
        return this._metadataKeyName;
    }

    constructor(keyName: string, message: string) {
        super(message);
        this._metadataKeyName = keyName;
    }

}