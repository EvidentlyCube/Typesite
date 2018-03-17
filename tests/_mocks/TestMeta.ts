import {IMeta} from "../../src";

export class TestMeta implements IMeta {
    getKey(): string {
        return 'test';
    }
}