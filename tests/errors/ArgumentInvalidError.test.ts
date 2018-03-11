import {expect} from 'chai';
import 'mocha';
import ArgumentInvalidError from "../../src/errors/ArgumentInvalidError";

describe('ArgumentInvalidError', () => {
    it('Should set argumentName property', () => {
        const value = "duck";
        const error = new ArgumentInvalidError(value);

        expect(error.getArgumentName()).to.equal(value);
    });

    it('Should set message property', () => {
        const value = "Test message";
        const error = new ArgumentInvalidError("", value);

        expect(error.message).to.equal(value);
    });

    it('Should extend Error', () => {
        const error = new ArgumentInvalidError("");

        expect(error).be.instanceOf(Error);
    });
});