
var passport = require('passport');

function init(app, callback) {
    'use strict';

    app.use(passport.initialize());
    app.use(passport.session());

    callback(null, []);
}

module.exports = init;
