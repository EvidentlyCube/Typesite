import {Frontmatter} from "./Frontmatter";
import {ContentFile, ContentFileCollection} from "../";
import {existsSync} from "fs";

export class FrontmatterLoader {
    public static async load(files: ContentFileCollection, file: ContentFile, targetPath: string): Promise<void> {
        const matchRegex = /\.tsx?$/;

        if (!matchRegex.test(targetPath)) {
            return;
        }

        if (!existsSync(file.absoluteSourcePath.filePath)) {
            return;
        }

        const imported = await import(file.absoluteSourcePath.filePath);
        if (!imported.hasOwnProperty('default')) {
            return;
        }

        if (!imported.default || !(imported.default instanceof Frontmatter)) {
            return;
        }

        const frontmatter: Frontmatter = imported.default;

        file.setContents(frontmatter.contents);
        frontmatter.metadata.forEach(meta => {
            file.metadata.setItem(meta);
        });

        files.moveFile(
            targetPath,
            targetPath.replace(/\.[^.]+$/, '')
        );
    }
}