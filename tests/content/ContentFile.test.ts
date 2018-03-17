import {expect} from 'chai';
import 'mocha';
import {ArgumentNullError, ContentFile, ContentFilePath} from "../../src";
import {normalize, resolve} from "path";
import {readFileSync} from "fs";

describe('ContentFile', () => {
    it("Should throw error when relative file path is null", () => {
        expect(() => new ContentFile(null, null)).to.throw(ArgumentNullError);
    });

    it("Should throw error when passed source directory is null", () => {
        expect(() => new ContentFile("Ducky.txt", null)).to.throw(ArgumentNullError);
    });

    it("Should set source path (ContentFilePath)", () => {
        const path = ContentFilePath.createFromPath("the/path/to/index.html");
        const file = new ContentFile(path, "");

        expect(file.relativeSourcePath.filePath).to.equal(path.filePath);
    });

    it("Should set source path (string)", () => {
        const path = "this/is/index.html";
        const file = new ContentFile(path, "");

        expect(file.relativeSourcePath.filePath).to.equal(normalize(path));
    });

    it("Should return correct absolute path", () => {
        const file = new ContentFile("some/path", ".");

        expect(file.absoluteSourcePath.filePath).to.equal(resolve("some/path"));
    });

    it("Should return read content", () => {
        const path = ContentFilePath.createFromPath("_fixtures/contentReader/htmlTest.html");
        const file = new ContentFile(path, __dirname + "/../");

        expect(file.getContents()).to.be.instanceOf(Buffer);
        expect((<Buffer>file.getContents()).toString()).to.equal(readFileSync(__dirname + "/../_fixtures/contentReader/htmlTest.html").toString());
    });

    it("Should return set content", () => {
        const file = new ContentFile(ContentFilePath.createFromPath("index.html"), "");
        const content = "Donald Duck";

        file.setContents(new Buffer(content, "utf8"));

        expect(file.hasModifiedContent).to.be.true;
        expect(file.getContents().toString()).to.equal(content);
    });

    it("Should return set content even if it was set to null", () => {
        const file = new ContentFile(ContentFilePath.createFromPath("index.html"), "");

        file.setContents(null);

        expect(file.hasModifiedContent).to.be.true;
        expect(file.getContents()).to.equal(null);
    });
});

