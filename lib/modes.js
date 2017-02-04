module.exports = (function () {
    /*
     * Default responses for the app:
     *  0 - Successful timed out response (2xx) where the status code is not altered
     *  1 - Successful response (2xx) where the status code is not altered
     *  2xx - Successful response (2xx) where the status code is changed to the the passed code
     *  4xx / 5xx - Error response where the status code is changed to the the passed code
     *  Other code are treated as success (1xx / 3xx)
     */
    const defaultResponseSet = [1, 401, 429, 500, 503, 504, 0];

    return {
        optimistic: {
            weights: [0.99, 0.005, 0.001, 0.001, 0.001, 0.001, 0.001],
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
            weights: [0.01, 0.01, 0.05, 0.4, 0.4, 0.1, 0.03],
            responses: defaultResponseSet
        }
    };
}());