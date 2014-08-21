var favicon = require('serve-favicon');

function staticFiles(app, express, projectDirs, callback) {
    'use strict';

    var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

    // TODO: Add support for env === 'test'.
    // Currently only 'development' and 'production are supported.
    app.use(favicon(projectDirs.build + '/' + env + '/client/favicon.ico'));
    app.use(express.static(projectDirs.build + '/' + env + '/client'));

    if (env === 'production') {
        // Ensures that Express trusts the 'X-Forwarded-*' header fields sent
        // by nginx
        app.enable('trust proxy');
        app.use(express.static(projectDirs.build + '/' + env + '/client/scripts'));
    } else if (env === 'development') {
        app.use(express.static(projectDirs.client + '/bower_components')); // jshint ignore:line
    }

    callback(null, []);
}

module.exports = staticFiles;
