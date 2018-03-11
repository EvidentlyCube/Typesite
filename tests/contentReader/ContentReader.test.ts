import {expect} from 'chai';
import 'mocha';
import {normalize} from 'path';
import ContentFileCollection from "../../src/content/ContentFileCollection";
import ContentReader from "../../src/contentReader/ContentReader";
import ArgumentNullError from "../../src/errors/ArgumentNullError";

describe('ContentFileCollection', () => {
    it("Should read files", () => {
        const reader = new ContentReader();
        return reader.readFiles(__dirname + "/../fixtures/contentReader")
            .then(filesCollection => {
                const filePaths = filesCollection.getAllRelativeFilePaths();

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

