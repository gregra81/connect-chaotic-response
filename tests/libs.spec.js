/*eslint no-undef: "off"*/

module.exports = (function () {
    'use strict';

    const expect = require('expect.js'),
        sinon = require('sinon'),
        httpMocks = require('node-mocks-http'),
        utils = require('../lib/utils'),
        modes = require('../lib/modes'),
        responsesSet = require('../lib/responses');


    describe('Libs', () => {
        describe('Modes', () => {
            it('should have proper modes', () => {
                expect(modes.hasOwnProperty('optimistic')).to.be.ok;
                expect(modes.hasOwnProperty('pessimistic')).to.be.ok;
                expect(modes.hasOwnProperty('timeout')).to.be.ok;
                expect(modes.hasOwnProperty('failure')).to.be.ok;
            });
            it('each mode should be a tuple of arrayed weights and responses', () => {
                for (const val in modes){
                    expect(modes[val].weights).to.be.an(Array);
                    expect(modes[val].responses).to.be.an(Array);
                }
            });

            it('each mode weights and responses array should not be empty', () => {
                for (const val in modes){
                    expect(modes[val].responses.length).to.be.greaterThan(0);
                    expect(modes[val].weights.length).to.be.greaterThan(0);
                    expect(modes[val].weights.length).to.be.equal(modes[val].responses.length);
                }
            });

            it('each mode weights length should equal responses length', () => {
                for (const val in modes){
                    expect(modes[val].weights.length).to.be.equal(modes[val].responses.length);
                }
            });

            it('each mode weight should be normalized to 1', () => {
                expect(modes.optimistic.weights.reduce((a, b) => a + b, 0)).to.equal(1);
                expect(modes.pessimistic.weights.reduce((a, b) => a + b, 0)).to.equal(1);
                expect(modes.timeout.weights.reduce((a, b) => a + b, 0)).to.equal(1);
                expect(modes.failure.weights.reduce((a, b) => a + b, 0)).to.equal(1);
            });
        });

        describe('Responses', () => {
            it('should exist', () => {
                expect(responsesSet).to.be.ok;
            });
            it('each response should be an integer between 100 and 600', () => {
                for (const status in responsesSet) {
                    if (responsesSet.hasOwnProperty(status)) {
                        expect(parseInt(status)).to.be.a('number');
                        expect(status).to.be.above(99);
                        expect(status).to.be.below(600);
                    } else {
                        throw new Error('Responses object is not valid');
                    }
                }
            });
        });

        describe('Utils', () => {

            it('should be able to validate custom mode', () => {
                expect(utils.validateCustomMode([1, 2, 3], [200, 400, 500])).to.be.ok;
            });

            it('validateCustomMode should throw on bad inputs', () => {

                expect(utils.validateCustomMode({}, null)).to.equal(false);
                expect(utils.validateCustomMode).withArgs([1, 2], [200]).to.throwException();
                expect(utils.validateCustomMode).withArgs([1, 2], [100, 200]).to.throwException();
            });

            it('should be able to set bad response', () => {
                const response = httpMocks.createResponse();
                sinon.stub(response, 'end');
                utils.setBadResponse(response, 500);
                sinon.assert.calledOnce(response.end);
            });

            it('randomizeWithWeightResponse should return correct response', () => {
                sinon.stub(Math, 'random').returns(0.4);
                expect(utils.randomizeWithWeightResponse([0.5, 0.5], [200, 500])).to.equal(200);
            });

            it('should be able to validate correct modes', () => {
                expect(utils.validateMode('optimistic')).to.be.ok;
                expect(utils.validateMode('pessimistic')).to.be.ok;
                expect(utils.validateMode('timeout')).to.be.ok;
                expect(utils.validateMode('failure')).to.be.ok;
                expect(utils.validateMode).withArgs('nonExistingMode').to.throwException();
            });

            it('should be able to normalize weights', () => {
                expect(utils.normalizeWeights([1, 2, 0.5, 1.5, 5])).to.eql([0.1, 0.2, 0.05, 0.15, 0.5]);
            });
        });
    });


}());