import {expect} from 'chai';
import 'mocha';
import {ArgumentNullError} from "../../src";

describe('ArgumentNullError', () => {
    it('Should set argumentName property', () => {
        const value = "duck";
        const error = new ArgumentNullError(value);

        expect(error.getArgumentName()).to.equal(value);
    });

    it('Should set message property', () => {
        const value = "Test message";
        const error = new ArgumentNullError("", value);

        expect(error.message).to.equal(value);
    });

    it('Should extend Error', () => {
        const error = new ArgumentNullError("");

        expect(error).be.instanceOf(Error);
    });
});