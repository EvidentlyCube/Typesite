import {IMeta} from "../";
import {InvalidMetadataError} from "../errors/InvalidMetadataError";
import {DuplicateMetadataError} from "../errors/DuplicateMetadataError";

export class Frontmatter {
    public contents: Buffer;
    public metadata: IMeta[];

    constructor(...params: any[]) {
        this.metadata = [];

        params.forEach((param, index) => {
            if (typeof param === 'string') {
                this.contents = new Buffer(param);
            } else if (param instanceof Buffer) {
                this.contents = param;
            } else {
                this.assertIsValidMetadata(param, index);
                this.assertMetadataNotAlreadyRegistered(<IMeta>param);
                this.metadata.push(param);
            }
        });
    }

    private assertIsValidMetadata(param: any, index: number): void {
        if (!param.getKey) {
            throw new InvalidMetadataError(`Metadata at index ${index} does not implement "IMeta" interface and has no 'getKey()' method`);
        }
    }

    private assertMetadataNotAlreadyRegistered(param: IMeta): void {
        this.metadata.forEach(meta => {
            if (meta.getKey() === param.getKey()) {
                throw new DuplicateMetadataError(param.getKey(), `Metadata '${param.getKey()}' is defined twice.`);
            }
        });
    }
}