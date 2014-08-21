
var passport = require('passport');

function csrf(app, callback) {
    'use strict';

    app.use(passport.initialize());
    app.use(passport.session());

    callback(null, []);
}

module.exports = csrf;
