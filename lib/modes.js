module.exports = (function () {
    const defaultResponseSet = [200, 401, 429, 500, 503, 504, 0];

    return {
        optimistic: {
            weights: [0.9, 0.05, 0.01, 0.01, 0.01, 0.01, 0.01],
            responses: defaultResponseSet
        },
        pessimistic: {
            weights: [0.5, 0.05, 0.05, 0.1, 0.1, 0.1, 0.1],
            responses: defaultResponseSet
        },
        timeout: {
            weights: [0.01, 0.01, 0.06, 0.01, 0.01, 0.1, 0.8],
            responses: defaultResponseSet
        },
        failure: {
            weights: [0.01, 0.01, 0.05, 0.4, 0.4, 0.1, 0.05],
            responses: defaultResponseSet
        }
    };
}());