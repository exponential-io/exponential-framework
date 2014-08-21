/**
 * Default handling middleware for 404 errors.
 */

function notFound(app, conf, callback) {
    'use strict';

    app.use(function fileNotFoundError(req, res) {
        var errorModel = {
            url: req.url,
            statusCode: 404
        };

        if (req.xhr) {
            res.status(404).send(errorModel);
        } else {
            res.status(404);
            res.render(conf.errors.notFound, errorModel);
        }
    });

    callback(null, []);
}

module.exports = notFound;
