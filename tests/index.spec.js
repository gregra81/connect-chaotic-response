/*eslint no-undef: "off"*/

module.exports = (function () {
    'use strict';

    const expect = require('expect.js'),
        sinon = require('sinon'),
        httpMocks = require('node-mocks-http'),
        ChaoticResponse = require('../index'),
        utils = require('../lib/utils');


    let sandbox;
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Chaos Response', () => {
        it('should be able to run the middleware', () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            sandbox.stub(utils, 'randomizeWithWeightResponse').returns(200);
            const cp = new ChaoticResponse();
            cp.middleware(request, response, function (nextResp) {
                expect(nextResp).to.be.ok;
            });
        });
        
        it('should return response after a timeout', (done) => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            sandbox.stub(utils, 'randomizeWithWeightResponse').returns(0);
            const cp = new ChaoticResponse({timeout:1000, mode: 'timeout'});
            cp.middleware(request, response, function (nextResp) {
                expect(nextResp).to.be.ok;
                done();
            });
        });

        it('should return a failed response', () => {
            const response = httpMocks.createResponse();
            const request = httpMocks.createRequest();
            sandbox.stub(utils, 'randomizeWithWeightResponse').returns(500);
            const cp = new ChaoticResponse({mode: 'failure'});
            sinon.spy(utils, 'setBadResponse');
            cp.middleware(request, response);
            sinon.assert.calledOnce(utils.setBadResponse);
        });

    });


}());