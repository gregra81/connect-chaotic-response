const chaosModes = require('./lib/modes'),
    utils = require('./lib/utils');

function ChaoticResponse(options) {

    const defaults = {
        mode: 'optimistic',
        customMode: {},
        timeout: 7000
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
            responses: responses
        };
    };

    this.callbackOnError = null;

    this.middleware = (req, res, next) => {
        const response = utils.randomizeWithWeightResponse(weights, responses);
        // measeure time
        const start = process.hrtime();
        if (Math.floor(response / 500) === 1 || Math.floor(response / 400) === 1) {
            res.statusCode = response;
            if (this.callbackOnError){
                this.callbackOnError(req, res);
            }
            utils.setBadResponse(res, response);
        } else if (response === 0) {
            setTimeout(function () { //eslint-disable-line
                res.elapsedTime = process.hrtime(start)[0];
                next();
            }, opts.timeout);
        } else {
            if (response !== 1) {
                res.statusCode = response;
            }
            next();
        }
    };
}

module.exports = ChaoticResponse;