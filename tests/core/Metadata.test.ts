import {expect} from 'chai';
import 'mocha';
import {Metadata} from "../../src";
import {IMeta} from "../../src";

describe('Metadata', () => {
    it("Should set and return items", () => {
        const item1 = new test_MT_1();
        const item2 = new test_MT_2();
        const item3 = new test_MT_3_ext_2();
        const meta = new Metadata();

        meta.setItem(item1);
        meta.setItem(item2);
        meta.setItem(item3);

        expect(meta.itemCount).to.equal(3);
        expect(meta.hasItem(test_MT_1)).to.be.true;
        expect(meta.hasItem(test_MT_2)).to.be.true;
        expect(meta.hasItem(test_MT_3_ext_2)).to.be.true;
        expect(meta.getItem(test_MT_1)).to.equal(item1);
        expect(meta.getItem(test_MT_2)).to.equal(item2);
        expect(meta.getItem(test_MT_3_ext_2)).to.equal(item3);
    });

    it("Should get all metas", () => {
        const item1 = new test_MT_1();
        const item2 = new test_MT_2();
        const item3 = new test_MT_3_ext_2();
        const meta = new Metadata();

        meta.setItem(item1);
        meta.setItem(item2);
        meta.setItem(item3);

        expect(meta.getAllItems()).to.be.lengthOf(3)
            .to.contain(item1)
            .to.contain(item2)
            .to.contain(item3);
    });

    it("Should remove item", () => {
        const item = new test_MT_1();
        const meta = new Metadata();

        meta.setItem(item);
        meta.removeItem(test_MT_1);

        expect(meta.itemCount).to.equal(0);
        expect(meta.hasItem(test_MT_1)).to.be.false;
        expect(meta.getItem(test_MT_1)).to.equal(null);
    });

    it("Setting same item again will override the old one", () => {
        const itemOld = new test_MT_1();
        const itemNew = new test_MT_1();
        const meta = new Metadata();

        meta.setItem(itemOld);
        meta.setItem(itemNew);

        expect(meta.itemCount).to.equal(1);
        expect(meta.getItem(test_MT_1)).to.equal(itemNew);
    });
});

class test_MT_1 implements IMeta {

    getKey(): string {
        return 'test_MT_1';
    }

    public toString(): string {
        return '[test_MT_1]';
    }
}

class test_MT_2 implements IMeta {
    getKey(): string {
        return 'test_MT_2';
    }

    public toString(): string {
        return '[test_MT_2]';
    }

}

class test_MT_3_ext_2 implements IMeta {
    getKey(): string {
        return 'test_MT_3_ext_2';
    }

    public toString(): string {
        return '[test_MT_3_ext_2]';
    }
}
