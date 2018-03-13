export class Metadata {
    private _map: any[] = [];

    public get itemCount(): number {
        return this._map.length;
    }

    public getItem<T>(classToGet: { new(): T; }): T {
        const item = this._map.find(item => item.constructor === classToGet);
        return typeof item === "undefined" ? null : item;
    }

    public hasItem<T>(classToCheck: { new(): T; }): boolean {
        return this.getItem(classToCheck) !== null;
    }

    public setItem(item: any): void {
        this.removeItem(item.constructor);
        this._map.push(item);
    }

    public removeItem<T>(classToRemove: { new(): T; }): void {
        this._map = this._map.filter(item => item.constructor !== classToRemove);
    }
}