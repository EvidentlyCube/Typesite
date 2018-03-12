import {expect} from 'chai';
import 'mocha';
import ContentFilePath from "../../src/content/ContentFilePath";
import ArgumentNullError from "../../src/errors/ArgumentNullError";
import ArgumentInvalidError from "../../src/errors/ArgumentInvalidError";
import {normalize} from "path";

describe('ContentFilePath', () => {
    it("Should throw ArgumentNullException when passing null to constructor", () => {
        expect(() => new ContentFilePath(null)).to.throw(ArgumentNullError);
    });

    it("Should throw ArgumentInvalidException when passing empty chunks array to constructor", () => {
        expect(() => new ContentFilePath([])).to.throw(ArgumentInvalidError);
    });

    it("Should throw ArgumentInvalidException when passing only nulls and empty string to constructor", () => {
        expect(() => new ContentFilePath([null, ''])).to.throw(ArgumentInvalidError);
    });

    it("Should return correct file path", () => {
        const path = new ContentFilePath(['test', 'dir', 'file.txt']);

        expect(path.filePath).to.equal(normalize("test/dir/file.txt"));
    });

    it("Should return correct dir path", () => {
        const path = new ContentFilePath(['test', 'dir', 'file.txt']);

        expect(path.directoryPath).to.equal(normalize("test/dir"));
    });

    it("Should return correct filename", () => {
        const path = new ContentFilePath(['test', 'dir', 'file.txt']);

        expect(path.filename).to.equal('file.txt');
    });

    it("Should return filename without extension", () => {
        const path = new ContentFilePath(['test', 'dir', 'file.txt']);

        expect(path.filenameWithoutExtension).to.equal('file');
    });

    it("Should return if a file is dot file", () => {
        const dotFile = new ContentFilePath(['.dot.file']);
        const notDotFile = new ContentFilePath(['not.dot.file']);

        expect(dotFile.isDotFile).to.equal(true);
        expect(notDotFile.isDotFile).to.equal(false);
    });

    it('Support regular files "test/dir/file.txt', () => {
        const path = new ContentFilePath(['test', 'dir', 'file.txt']);

        expect(path.isDotFile).to.equal(false, 'Testing filename');
        expect(path.filename).to.equal("file.txt", 'Testing filename');
        expect(path.extension).to.equal("txt", 'Testing extension');
        expect(path.filenameWithoutExtension).to.equal("file", "Testing filenameWithoutExtension");
    });

    it('Support files without extensions "test/dir/file"', () => {
        const path = new ContentFilePath(['test', 'dir', 'file']);

        expect(path.isDotFile).to.equal(false, 'Testing isDotFile');
        expect(path.filename).to.equal("file", 'Testing filename');
        expect(path.extension).to.equal("", 'Testing extension');
        expect(path.filenameWithoutExtension).to.equal("file", "Testing filenameWithoutExtension");
    });

    it('Support dot files "test/dir/.txt', () => {
        const path = new ContentFilePath(['test', 'dir', '.txt']);

        expect(path.isDotFile).to.equal(true, 'Testing filename');
        expect(path.filename).to.equal(".txt", 'Testing filename');
        expect(path.extension).to.equal("", 'Testing extension');
        expect(path.filenameWithoutExtension).to.equal(".txt", "Testing filenameWithoutExtension");
    });

    it("Should join paths", () => {
        expect(ContentFilePath.createFromPath("test/path").join("foo").filePath).to.equal(normalize('test/path/foo'));
        expect(ContentFilePath.createFromPath("test/path").join("..").filePath).to.equal(normalize('test'));
        expect(ContentFilePath.createFromPath("test/path").join("../buck").filePath).to.equal(normalize('test/buck'));
    });

    it("Should create identical path regardless of separator", () => {
        const pathBase = "this/is/test/dir/file.txt";
        const pathSlashes = ContentFilePath.createFromPath(pathBase);
        const pathBackslashes = ContentFilePath.createFromPath(pathBase.replace(/\//g, '\\'));

        expect(pathSlashes.filePath).to.equal(normalize(pathBase));
        expect(pathBackslashes.filePath).equal(normalize(pathBase));
    });

    it('should return a copy', function () {
        const pathBase = ContentFilePath.createFromPath("this/is/path.txt");
        const pathCopy = pathBase.copy;

        expect(pathCopy.filePath).to.equal(pathBase.filePath);
        expect(pathCopy).to.not.equal(pathBase);
    });

    it("Should return string representation", function () {
        const path = ContentFilePath.createFromPath("ducks/are/the/best.txt");

        expect(path.toString()).to.equal(`[ContentFilePath "${normalize('ducks/are/the/best.txt')}"]`)
    });});