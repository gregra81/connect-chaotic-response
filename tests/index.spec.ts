import { chaosModes } from '../lib/modes';

const expect = require('expect');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
import { ChaoticResponse } from '../index';
import * as utils from '../lib/utils';
import { chaosModes as modes } from '../lib/modes';


describe('index', () => {
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
      const timeout = 500;
      const cp = new ChaoticResponse({ timeout: timeout, mode: 'timeout' });
      const initTime = new Date().getTime();
      cp.middleware(mockedRequest, mockedResponse, function (nextResp) {
        const finalTime = new Date().getTime();
        expect(nextResp).to.be.ok;
        expect(finalTime - initTime).to.be.greaterThan(timeout - 1);
        done();
      });
    });

    it('should return a failed response', () => {
      sandbox.stub(utils, 'randomizeWithWeightResponse').returns(500);
      const cp = new ChaoticResponse({ mode: 'failure' });
      sinon.spy(utils, 'setBadResponse');
      cp.middleware(mockedRequest, mockedResponse);
      sinon.assert.calledOnce(utils.setBadResponse);
    });

    it('should set a new mode when setMode is called', () => {
      const cp = new ChaoticResponse({ mode: 'failure' });
      cp.setMode('timeout');
      const newMode = {
        weights: modes.timeout.weights,
        responses: modes.timeout.responses
      };
      expect(cp.getMode()).to.eql(newMode);
    });

    it('should set a custom mode', function () {
      const options = {
        customMode: {
          weights: utils.normalizeWeights([1, 4, 5]),
          responses: [201, 409, 0]
        }
      };
      const cp = new ChaoticResponse(options);
      expect(cp.getMode()).to.eql(options.customMode);
    });

    it('should have a callback function for error responses', () => {
      const cp = new ChaoticResponse({ mode: 'failure' });
      expect(cp.callbackOnError).to.be.ok;

    });
  });
});
