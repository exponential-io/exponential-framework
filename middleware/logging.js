/**
 * Express logging middleware
 */
var morgan = require('morgan');

function logging(app, express, callback) {
    'use strict';

    app.use(morgan('dev'));

    callback(null, []);
}

module.exports = logging;
