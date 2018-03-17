import {IMeta} from "./IMeta";
import {Stats} from "fs";

export class StatsMeta implements IMeta {
    public stats: Stats;

    constructor(stats: Stats) {
        this.stats = stats;
    }

    public getKey(): string {
        return 'stats';
    }
}