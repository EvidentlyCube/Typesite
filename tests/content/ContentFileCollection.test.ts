import {expect} from 'chai';
import 'mocha';
import ContentFile from "../../src/content/ContentFile";
import ContentFileCollection from "../../src/content/ContentFileCollection";
import ContentFilePath from "../../src/content/ContentFilePath";
import ArgumentNullError from "../../src/errors/ArgumentNullError";
import ArgumentInvalidError from "../../src/errors/ArgumentInvalidError";
import {normalize, resolve} from "path";

describe('ContentFileCollection', () => {
    it("Should add and return added file correctly", () => {
        const file = new ContentFile(ContentFilePath.createFromPath("this/is/file.txt"));
        const collection = new ContentFileCollection();
        collection.addFile(file.relativeSourcePath, file);

        expect(collection.getFile(file.relativeSourcePath)).to.equal(file);
        expect(collection.getFile(file.relativeSourcePath.filePath)).to.equal(file);
    });
    it("Should return null when getting file that does not exist", () => {
        const collection = new ContentFileCollection();

        expect(collection.getFile("test")).to.equal(null);
        expect(collection.getFile("other/path")).to.equal(null);
        expect(collection.getFile("no/file.here")).to.equal(null);
    });

    it("Should throw error when adding file to null path", () => {
        const collection = new ContentFileCollection();
        expect(() => collection.addFile(null, null)).to.throw(ArgumentNullError);
    });

    it("Should throw error when adding null file", () => {
        const collection = new ContentFileCollection();
        expect(() => collection.addFile("path", null)).to.throw(ArgumentNullError);
    });

    it("Should throw error when adding file to existing path", () => {
        const collection = new ContentFileCollection();
        collection.addFile("path", new ContentFile(ContentFilePath.createFromPath('path')));

        expect(() => collection.addFile("path", new ContentFile(ContentFilePath.createFromPath('path')))).to.throw(ArgumentInvalidError);
    });

    it("Should throw error when getting file with null path", () => {
        const collection = new ContentFileCollection();
        expect(() => collection.getFile(null)).to.throw(ArgumentNullError);
    });

    it("Should return true when file is added", () => {
        const file = new ContentFile(ContentFilePath.createFromPath("this/is/file.txt"));
        const collection = new ContentFileCollection();
        collection.addFile(file.relativeSourcePath, file);

        expect(collection.hasFile(file.relativeSourcePath)).to.equal(true);
        expect(collection.hasFile(file.relativeSourcePath.filePath)).to.equal(true);
    });

    it("Should return false when file is not added", () => {
        const collection = new ContentFileCollection();

        expect(collection.hasFile("test")).to.equal(false);
        expect(collection.hasFile("other/path")).to.equal(false);
        expect(collection.hasFile("no/file.here")).to.equal(false);
    });

    it("Should throw error when checking for file with null path", () => {
        const collection = new ContentFileCollection();
        expect(() => collection.hasFile(null)).to.throw(ArgumentNullError);
    });

    it("Should remove file", () => {
        const file = new ContentFile(ContentFilePath.createFromPath("this/is/file.txt"));
        const collection = new ContentFileCollection();

        collection.addFile(file.relativeSourcePath, file);
        collection.removeFile(file.relativeSourcePath);
        expect(collection.hasFile(file.relativeSourcePath)).to.equal(false);

        collection.addFile(file.relativeSourcePath, file);
        collection.removeFile(file.relativeSourcePath);
        expect(collection.hasFile(file.relativeSourcePath.filePath)).to.equal(false);
    });

    it("Should throw error when removing file with null path", () => {
        const collection = new ContentFileCollection();
        expect(() => collection.removeFile(null)).to.throw(ArgumentNullError);
    });

    it("Should fire callback on every file", () => {
        const file1 = new ContentFile(ContentFilePath.createFromPath("this/is/file.1"));
        const file2 = new ContentFile(ContentFilePath.createFromPath("this/is/file.2"));
        const file3 = new ContentFile(ContentFilePath.createFromPath("this/is/file.3"));
        const collection = new ContentFileCollection();
        collection.addFile(file1.relativeSourcePath, file1);
        collection.addFile(file2.relativeSourcePath, file2);
        collection.addFile(file3.relativeSourcePath, file3);

        const calledFiles = [];
        collection.eachSync(file => calledFiles.push(file));

        expect(calledFiles.length).to.equal(3);
        expect(calledFiles).to.contain(file1);
        expect(calledFiles).to.contain(file2);
        expect(calledFiles).to.contain(file3);
    });

    it("Should fire callback on every file asynchronously", () => {
        const file1 = new ContentFile(ContentFilePath.createFromPath("this/is/file.1"));
        const file2 = new ContentFile(ContentFilePath.createFromPath("this/is/file.2"));
        const file3 = new ContentFile(ContentFilePath.createFromPath("this/is/file.3"));
        const collection = new ContentFileCollection();
        collection.addFile(file1.relativeSourcePath, file1);
        collection.addFile(file2.relativeSourcePath, file2);
        collection.addFile(file3.relativeSourcePath, file3);

        const calledFiles = [];
        return collection.eachAsync(file => calledFiles.push(file))
            .then(() => {
                expect(calledFiles.length).to.equal(3);
                expect(calledFiles).to.contain(file1);
                expect(calledFiles).to.contain(file2);
                expect(calledFiles).to.contain(file3);
            });
    });

    it("Should return all file paths", () => {
        const file1 = new ContentFile(ContentFilePath.createFromPath("this/is/file.1"));
        const file2 = new ContentFile(ContentFilePath.createFromPath("this/is/file.2"));
        const file3 = new ContentFile(ContentFilePath.createFromPath("this/is/file.3"));
        const collection = new ContentFileCollection();
        collection.addFile(file1.relativeSourcePath, file1);
        collection.addFile(file2.relativeSourcePath, file2);
        collection.addFile(file3.relativeSourcePath, file3);

        expect(collection.getAllRelativeFilePaths())
            .to.be.lengthOf(3)
            .to.contain(file1.relativeSourcePath.filePath)
            .to.contain(file2.relativeSourcePath.filePath)
            .to.contain(file3.relativeSourcePath.filePath);
    });

    it("Should move file", () => {
        const fromPath = "path/from/file.txt";
        const toPath = "path/to/file.txt";
        const file = new ContentFile(ContentFilePath.createFromPath(fromPath));
        const collection = new ContentFileCollection();
        collection.addFile(file.relativeSourcePath, file);
        collection.moveFile(fromPath, toPath);

        expect(collection.hasFile(fromPath)).to.equal(false);
        expect(collection.hasFile(toPath)).to.equal(true);
    });

    it("Should throw exception when moving and from is null", () => {
        const collection = new ContentFileCollection();
        expect(() => collection.moveFile(null, null)).to.throw(ArgumentNullError);
    });
    it("Should throw exception when moving and to is null", () => {
        const collection = new ContentFileCollection();
        expect(() => collection.moveFile("test", null)).to.throw(ArgumentNullError);
    });
    it("Should throw exception when moving and source file does not exist", () => {
        const collection = new ContentFileCollection();
        expect(() => collection.moveFile("from", "to")).to.throw(ArgumentInvalidError);
    });
    it("Should throw exception when moving and target pathis occupied", () => {
        const collection = new ContentFileCollection();
        collection.addFile("from", new ContentFile(ContentFilePath.createFromPath("from")));
        collection.addFile("to", new ContentFile(ContentFilePath.createFromPath("to")));
        expect(() => collection.moveFile("from", "to")).to.throw(ArgumentInvalidError);
    });
    it("Should set source path to absolute path", () => {
        const collection = new ContentFileCollection("test/dir");
        expect(collection.sourcePath).to.equal(resolve("test/dir"));
    });
    it("Should set source path to exactly given path if it is absolute (unix)", () => {
        const collection = new ContentFileCollection("/var/lib/test/dir");
        expect(collection.sourcePath).to.equal(normalize("/var/lib/test/dir"));
    });
    it("Should set source path to exactly given path if it is absolute (win32)", () => {
        const collection = new ContentFileCollection("C:/project/duck");
        expect(collection.sourcePath).to.equal(normalize("C:/project/duck"));
    });
});

