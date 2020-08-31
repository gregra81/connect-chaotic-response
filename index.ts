const chaosModes = require('./lib/modes'),
  utils = require('./lib/utils');

function ChaoticResponse(options) {
  const defaults = {
    mode: 'optimistic',
    customMode: {},
    timeout: 7000,
  };
  const opts = Object.assign({}, defaults, options || {});

  utils.validateMode(opts.mode);

  let weights = chaosModes[opts.mode].weights,
    responses = chaosModes[opts.mode].responses;

  if (opts.customMode && utils.validateCustomMode(opts.customMode.weights, opts.customMode.responses)) {
    weights = opts.customMode.weights;
    responses = opts.customMode.responses;
  }

  weights = utils.normalizeWeights(weights);

  this.setMode = (mode) => {
    utils.validateMode(mode);
    opts.mode = mode;
    weights = chaosModes[mode].weights;
    responses = chaosModes[mode].responses;
  };

  this.getMode = () => {
    return {
      weights: weights,
      responses: responses,
    };
  };

  this.callbackOnError = null;

  this.middleware = (req, res, next) => {
    const responseCode = utils.randomizeWithWeightResponse(weights, responses);
    // measure time
    const start = process.hrtime();
    if (Math.floor(responseCode / 500) === 1 || Math.floor(responseCode / 400) === 1) {
      res.statusCode = responseCode;
      if (this.callbackOnError) {
        this.callbackOnError(req, res);
      }
      utils.setBadResponse(res, responseCode);
    } else if (responseCode === 0) {
      setTimeout(function () {
        //eslint-disable-line
        res.elapsedTime = process.hrtime(start)[0];
        next();
      }, opts.timeout);
    } else {
      if (responseCode !== 1) {
        res.statusCode = responseCode;
      }
      next();
    }
  };
}

module.exports = ChaoticResponse;
