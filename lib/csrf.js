
var csurf = require('csurf');

function csrf(app, express, callback) {
    'use strict';

    app.use(csurf());

    callback(null, []);
}

module.exports = csrf;
