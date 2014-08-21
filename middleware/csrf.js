'use strict';

/**
 * Insert the CSRF token into the `token` variable which is accessible in
 * templates.
 */
module.exports = {
    token: function(req, res, next) {
        res.locals.token = req.csrfToken();
        next();
    },
    xsrfCookie: function(req, res, next) {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        next();
    }
};
