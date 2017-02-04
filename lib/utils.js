const responsesSet = require('./responses');
const chaosModes = require('./modes');

const validateCustomMode = (weights, responses) => {
    if (weights && responses && Array.isArray(weights) && Array.isArray(responses) &&
        weights.length > 0 && responses.length > 0) {

        if (weights.length === responses.length) {
            for (const i in responses) {
                if (responses[i] === 0 || responses[i] === 1){
                    return true;
                }

                if (!responsesSet.hasOwnProperty(responses[i])) {
                    throw new Error(`${responses[i]} is not included in the allowed responses`);
                }
            }
        } else {
            throw new Error('responses and weights arrays should have the same length');
        }
        return true;
    }
    return false;
};

const setBadResponse = (res, responseCode) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = responseCode;
    res.end(JSON.stringify({'message': responsesSet[responseCode]}));
};

const randomizeWithWeightResponse = (weights, responses) => {
    const num = Math.random(),
        lastIndex = weights.length - 1;
    let s = 0;

    for (var i = 0; i < lastIndex; ++i) {
        s += weights[i];
        if (num < s) {
            return responses[i];
        }
    }
    return responses[lastIndex];
};

const validateMode = (mode) => {
    const allowedModes = Object.keys(chaosModes).map((key) => ` ${key}`);
    if (!chaosModes.hasOwnProperty(mode)) {
        throw new Error(`The mode '${mode}' does not exist. Available modes are:${allowedModes}`);
    }

    return true;
};

const normalizeWeights = (weights) => {
    // get the sum of all weights
    const weightsSum = weights.reduce((a, b) => a + b , 0);

    // normalize
    return weights.map(w => w / weightsSum);
};

module.exports = {
    validateCustomMode,
    setBadResponse,
    randomizeWithWeightResponse,
    validateMode,
    normalizeWeights
};