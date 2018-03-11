export default class ArgumentNullError extends Error {
    private _argumentName: string;

    public getArgumentName(): string {
        return this._argumentName;
    }

    constructor(argumentName: string, message: string = "") {
        super(message);

        this._argumentName = argumentName;
    }

    toString(): string {
        return `Argument "${this.getArgumentName()}" cannot be null: ${this.message}`;
    }
}