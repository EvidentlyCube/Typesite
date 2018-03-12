import {expect} from 'chai';
import 'mocha';
import {normalize} from 'path';
import ContentReader from "../../src/contentReader/ContentReader";
import ArgumentNullError from "../../src/errors/ArgumentNullError";

describe('ContentReader', () => {
    it("Should read files and set collection's directory", () => {
        const reader = new ContentReader();
        const sourceDir = normalize(__dirname + "/../fixtures/contentReader");

        return reader.readFiles(sourceDir)
            .then(filesCollection => {
                const filePaths = filesCollection.getAllRelativeFilePaths();

                expect(filesCollection.sourcePath).to.equal(sourceDir);

                expect(filePaths.length).to.equal(7);
                expect(filePaths).to.contain(normalize('cssTest.css'));
                expect(filePaths).to.contain(normalize('htmlTest.html'));
                expect(filePaths).to.contain(normalize('testPng.png'));
                expect(filePaths).to.contain(normalize('testSvg.svg'));
                expect(filePaths).to.contain(normalize('subdir/.url'));
                expect(filePaths).to.contain(normalize('subdir/someFile.txt'));
                expect(filePaths).to.contain(normalize('subdir/another/noExtension'));
            });
    });

    it("Should throw error when path is null", () => {
        const reader = new ContentReader();

        return reader.readFiles(null)
            .then(() => expect.fail())
            .catch(error => expect(error).to.be.instanceOf(ArgumentNullError));
    });
});

