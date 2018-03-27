export class FileIterationError extends Error {
    private _filePath: string;
    private _innerError: any;

    public get filePath(): string{
        return this._filePath;
    }

    public get innerError(): any{
        return this._innerError;
    }

    constructor(filePath: string, innerError: any) {
        let message: string;
        if (innerError && innerError.message){
            message = innerError.message;
        } else if (typeof innerError === "string"){
            message = innerError;
        } else {
            message = "Unknown error";
        }

        super(`Error in file "${filePath}": ${message}`);

        this._filePath = filePath;
        this._innerError = innerError;
    }

    toString(): string {
        return this.message;
    }
}