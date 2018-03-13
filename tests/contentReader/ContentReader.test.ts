import {expect} from 'chai';
import 'mocha';
import {normalize, resolve} from 'path';
import {ArgumentNullError, ContentReader} from "../../src";

describe('ContentReader', () => {
    it("Should read files and set collection's directory", () => {
        const reader = new ContentReader();
        const sourceDir = normalize(__dirname + "/../fixtures/contentReader");

        return reader.readFiles(sourceDir)
            .then(filesCollection => {
                const filePaths = filesCollection.getAllRelativeFilePaths();

                expect(filesCollection.sourcePath).to.equal(sourceDir);

                expect(filePaths).to.have.lengthOf(7)
                    .to.contain(normalize('cssTest.css'))
                    .to.contain(normalize('htmlTest.html'))
                    .to.contain(normalize('testPng.png'))
                    .to.contain(normalize('testSvg.svg'))
                    .to.contain(normalize('subdir/.url'))
                    .to.contain(normalize('subdir/someFile.txt'))
                    .to.contain(normalize('subdir/another/noExtension'));

                expect(filesCollection.getFile('cssTest.css').absoluteSourcePath.filePath).to.equal(resolve(sourceDir, "cssTest.css"));
            });
    });

    it("Should throw error when path is null", () => {
        const reader = new ContentReader();

        return reader.readFiles(null)
            .then(() => expect.fail())
            .catch(error => expect(error).to.be.instanceOf(ArgumentNullError));
    });
});

