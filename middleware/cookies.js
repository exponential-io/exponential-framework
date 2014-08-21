
var cookieParser = require('cookie-parser');

function cookies(app, express, callback) {
    'use strict';

    app.use(cookieParser());
    // TODO: Upgrade to signed cookies
    // app.use(express.cookieParser('some secret'));

    callback(null, []);
}

module.exports = cookies;
