import {expect} from 'chai';
import 'mocha';
import {tmpdir} from "os";
import {join} from "path";
import {ContentFile, ContentFileCollection, ContentWriter} from "../../src";
import {existsSync, readFileSync} from "fs";

describe('ContentWriter', () => {
    const fixturesPath: string = __dirname + "/../_fixtures/contentReader/";

    it("Should write files with predefined content", async () => {
        const targetDir = join(tmpdir(), "typesite-" + Date.now().valueOf().toString());
        const file1 = new ContentFile(".tmp", fixturesPath);
        const file2 = new ContentFile(".tmp", fixturesPath);
        const file3 = new ContentFile(".tmp", fixturesPath);

        file1.setContents(new Buffer("Duck 1"));
        file2.setContents(new Buffer("Duck 2"));
        file3.setContents(new Buffer("Duck 3"));

        const files = new ContentFileCollection();
        files.addFile("file1.txt", file1);
        files.addFile("subdir/file1.txt", file2);
        files.addFile("even/more/subdir/file1.txt", file3);

        const writer = new ContentWriter();
        await writer.writeFiles(files, targetDir);

        expect(existsSync(`${targetDir}/file1.txt`)).to.be.true;
        expect(existsSync(`${targetDir}/subdir/file1.txt`)).to.be.true;
        expect(existsSync(`${targetDir}/even/more/subdir/file1.txt`)).to.be.true;

        expect(readFileSync(`${targetDir}/file1.txt`, {encoding: "utf8"})).to.equal("Duck 1");
        expect(readFileSync(`${targetDir}/subdir/file1.txt`, {encoding: "utf8"})).to.equal("Duck 2");
        expect(readFileSync(`${targetDir}/even/more/subdir/file1.txt`, {encoding: "utf8"})).to.equal("Duck 3");
    });

    it("Should write files with source path", async () => {
        const targetDir = join(tmpdir(), "typesite-" + Date.now().valueOf().toString());
        const file1 = new ContentFile("cssTest.css", fixturesPath);
        const file2 = new ContentFile("subdir/someFile.txt", fixturesPath);
        const file3 = new ContentFile("subdir/another/noExtension", fixturesPath);

        const files = new ContentFileCollection(fixturesPath);
        files.addFile(file1.relativeSourcePath, file1);
        files.addFile(file2.relativeSourcePath, file2);
        files.addFile(file3.relativeSourcePath, file3);

        const writer = new ContentWriter();
        await writer.writeFiles(files, targetDir);

        expect(existsSync(`${targetDir}/cssTest.css`)).to.be.true;
        expect(existsSync(`${targetDir}/subdir/someFile.txt`)).to.be.true;
        expect(existsSync(`${targetDir}/subdir/another/noExtension`)).to.be.true;

        expect(readFileSync(`${targetDir}/cssTest.css`, {encoding: "utf8"}))
            .to.equal(readFileSync(`${fixturesPath}/cssTest.css`, {encoding: "utf8"}));
        expect(readFileSync(`${targetDir}/subdir/someFile.txt`, {encoding: "utf8"}))
            .to.equal(readFileSync(`${fixturesPath}/subdir/someFile.txt`, {encoding: "utf8"}));
        expect(readFileSync(`${targetDir}/subdir/another/noExtension`, {encoding: "utf8"}))
            .to.equal(readFileSync(`${fixturesPath}/subdir/another/noExtension`, {encoding: "utf8"}));
    });
});

