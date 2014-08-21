/**
 * Default handling middleware for 500 errors.
 */

function serverError(app, conf, callback) {
    'use strict';

    var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

    app.use(function internalServerError(err, req, res, next) {
        var errorModel = {
            url: req.url,
            err: err,
            statusCode: 500
        };

        // Show errors in the console in development. In production, the
        // developer must have properly logged the error or else debugging the
        // problem will be difficult.
        if (env === 'development') {
            console.error(err.stack);
        }

        if (req.xhr) {
            res.status(500).send(errorModel);
        } else {
            res.status(500);
            res.render(conf.errors.serverError, errorModel);
        }
    });

    callback(null, []);
}

module.exports = serverError;
