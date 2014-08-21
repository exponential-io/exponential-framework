function jsonp(app, callback) {
    'use strict';

    app.enable('jsonp callback');

    callback(null, []);
}

module.exports = jsonp;
