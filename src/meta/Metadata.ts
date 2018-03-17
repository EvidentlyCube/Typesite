import {IMeta} from "./IMeta";

export class Metadata {
    private _map: { [id: string]: IMeta; } = {};

    public get itemCount(): number {
        return Object.keys(this._map).length;
    }

    public getItem<T extends IMeta>(classOrKey: { new(...params: any[]): T; } | string): T {
        const key = this.findMetaKey(classOrKey);

        return key && this._map.hasOwnProperty(key)
            ? <T>this._map[key]
            : null;
    }

    public hasItem<T extends IMeta>(classOrKey: { new(...params: any[]): T; } | string): boolean {
        return this.getItem(this.findMetaKey(classOrKey)) !== null;
    }

    public setItem(item: IMeta): void {
        this.removeItem(item.getKey());
        this._map[item.getKey()] = item;
    }

    public removeItem<T extends IMeta>(classOrKey: { new(...params: any[]): T; } | string): void {
        const key = this.findMetaKey(classOrKey);

        if (this._map.hasOwnProperty(key)) {
            delete (this._map[key]);
        }
    }

    private findMetaKey<T extends IMeta>(classOrKey: { new(...params: any[]): T; } | string): string {
        if (typeof classOrKey === "string") {
            return classOrKey;
        }

        for (let key in this._map) {
            if (this._map[key].constructor === classOrKey) {
                return key;
            }
        }

        return null;
    }
}