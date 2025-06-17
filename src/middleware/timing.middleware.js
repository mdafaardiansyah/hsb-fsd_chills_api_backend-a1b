/**
 * @fileoverview Timing middleware for request processing time tracking
 * @description Adds request start time to track processing duration
 */

/**
 * @function addRequestTiming
 * @description Middleware to add request start time for performance tracking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function addRequestTiming(req, res, next) {
    req.startTime = Date.now();
    next();
}

module.exports = {
    addRequestTiming
};