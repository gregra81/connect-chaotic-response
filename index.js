const chaosModes = require('./lib/modes');
const utils = require('./lib/utils');

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

    this.middleware = (req, res, next) => {
        const response = utils.randomizeWithWeightResponse(weights, responses);
        
        if (Math.floor(response / 500) === 1) {
            utils.setBadResponse(res, response);
        } else if (response === 0) {
            setTimeout(function () { //eslint-disable-line
                next();
            }, opts.timeout);
        } else {
            next();
        }
    };
}

module.exports = ChaoticResponse;