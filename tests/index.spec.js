/*eslint no-undef: "off"*/

module.exports = (function () {
    'use strict';

    const expect = require('expect.js'),
        sinon = require('sinon'),
        httpMocks = require('node-mocks-http'),
        ChaoticResponse = require('../index'),
        utils = require('../lib/utils'),
        modes = require('../lib/modes');

    let sandbox,
        mockedRequest,
        mockedResponse;

    before(() => {
        mockedRequest = httpMocks.createRequest();
        mockedResponse = httpMocks.createResponse();
    });

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Chaos Response', () => {
        it('should be able to run the middleware', () => {

            sandbox.stub(utils, 'randomizeWithWeightResponse').returns(200);
            const cp = new ChaoticResponse();
            cp.middleware(mockedRequest, mockedResponse, function (nextResp) {
                expect(nextResp).to.be.ok;
            });
        });
        
        it('should return response after a timeout', (done) => {
            sandbox.stub(utils, 'randomizeWithWeightResponse').returns(0);
            const cp = new ChaoticResponse({timeout:1000, mode: 'timeout'});
            cp.middleware(mockedRequest, mockedResponse, function (nextResp) {
                expect(nextResp).to.be.ok;
                done();
            });
        });

        it('should return a failed response', () => {
            sandbox.stub(utils, 'randomizeWithWeightResponse').returns(500);
            const cp = new ChaoticResponse({mode: 'failure'});
            sinon.spy(utils, 'setBadResponse');
            cp.middleware(mockedRequest, mockedResponse);
            sinon.assert.calledOnce(utils.setBadResponse);
        });

        it('should set a new mode when setMode is called', function(){
            const cp = new ChaoticResponse({mode: 'failure'});
            cp.setMode('timeout');
            const newMode = {
                weights: modes.timeout.weights,
                responses: modes.timeout.responses
            };
            expect(cp.getMode()).to.eql(newMode);
        });

    });


}());