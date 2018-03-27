import {IPlugin} from "../";

export class PluginError extends Error {
    private _plugin: IPlugin;
    private _filePath: string;
    private _innerError: any;

    public get plugin(): IPlugin{
        return this._plugin;
    }

    public get filePath(): string{
        return this._filePath;
    }

    public get innerError(): any{
        return this._innerError;
    }

    constructor(plugin: IPlugin, filePath:string, innerError: any) {
        let message;
        let fileNameMessage = "";

        if (filePath){
            fileNameMessage = ` in file '${filePath}'`;

        } else {
            if (innerError && innerError.message){
                message = innerError.message;
            } else if (typeof innerError === "string"){
                message = innerError;
            } else {
                message = "Unknown error";
            }
        }

        super(`Error in plugin '${plugin.getName()}'${fileNameMessage}: ${message}`);

        this._plugin = plugin;
        this._filePath = filePath;
        this._innerError = innerError;
    }


    toString(): string {
        return this.message;
    }
}