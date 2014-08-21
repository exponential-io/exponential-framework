
var flash = require('connect-flash');

function flashMessages(app, callback) {
    'use strict';

    app.use(flash());

    callback(null, []);
}

module.exports = flashMessages;
