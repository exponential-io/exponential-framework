/**
 * Setup handlebars to use either the development build views directory or the
 * production build views directory.
 */
var exphbs  = require('express3-handlebars'),
    helpers = require(global.dirs.views + '/helpers');

function handlebars(app, express, projectDirs, callback) {
    'use strict';

    var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
        viewsDir = projectDirs.build + '/' + env + '/server/views',
        layoutsDir = viewsDir + '/layouts',
        partialsDir = viewsDir + '/partials';

    var hbs = exphbs.create({
        defaultLayout: 'main',
        extname: '.hbs',
        helpers: helpers,
        layoutsDir: layoutsDir,
        partialsDir: partialsDir
    });
    app.engine('hbs', hbs.engine);
    app.set('views', viewsDir);
    app.set('view engine', 'hbs');

    callback(null, []);
}

module.exports = handlebars;
