import {ContentFileCollection} from "../content/ContentFileCollection";
import {Typesite} from "./Typesite";

export interface IPlugin {
    getName(): string;

    run(files: ContentFileCollection, typesite: Typesite): Promise<void>;
}