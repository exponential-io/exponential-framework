
var bodyParser     = require('body-parser'),
    methodOverride = require('method-override');

function bodyParsers(app, express, callback) {
    'use strict';

    // parse application/json
    app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({extended: false}));

    // NOTE It is very important that this module is used before any module
    // that needs to know the method of the request (for example, it must be
    // used prior to the csurf module).
    app.use(methodOverride());

    callback(null, []);
}

module.exports = bodyParsers;
