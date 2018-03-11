import {expect} from 'chai';
import 'mocha';
import ContentFile from "../../src/content/ContentFile";
import ContentFilePath from "../../src/content/ContentFilePath";

describe('ContentFile', () => {
    it("Should set source path", () => {
        const path = ContentFilePath.createFromPath("index.html");
        const file = new ContentFile(path);

        expect(file.relativeSourcePath.filePath).to.equal(path.filePath);
    });

    it("Should return source path as default content", () => {
        const path = ContentFilePath.createFromPath("index.html");
        const file = new ContentFile(path);

        expect(file.getContents()).to.be.instanceOf(ContentFilePath);
        expect((<ContentFilePath>file.getContents()).filePath).to.equal(path.filePath);
    });

    it("Should return set content", () => {
        const file = new ContentFile(ContentFilePath.createFromPath("index.html"));
        const content = "Donald Duck";

        file.setContents(new Buffer(content, "utf8"));

        expect(file.getContents()).to.be.instanceOf(Buffer);
        expect((<Buffer>file.getContents()).toString()).to.equal(content);
    });

    it("Should return set content even if it was set to null", () => {
        const file = new ContentFile(ContentFilePath.createFromPath("index.html"));

        file.setContents(null);

        expect(file.getContents()).to.equal(null);
    });
});

