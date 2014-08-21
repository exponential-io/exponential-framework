/**
 * ExpressJS server startup file
 */

// TODO: MOVE THE TIMER INTO A FUNCTION

var start = process.hrtime();

var elapsedTime = function(note) {
    'use strict';

    // 3 decimal places
    var precision = 3;

    // divide by a million to get nano to milli
    var elapsed = process.hrtime(start)[1] / 1000000;

    // console.log(process.hrtime(start)[0] + ' s, ' + elapsed.toFixed(precision) + ' ms - ' + note);
    console.log(
        chalk.blue('Performance:'),
        chalk.white(process.hrtime(start)[0]),
        chalk.blue('sec'),
        chalk.white(elapsed.toFixed(precision)),
        chalk.blue('ms'),
        chalk.white(note)
    );

    // Reset the time if you want the time between operations
    //start = process.hrtime();
};

var express       = require('express'),
    frameworkDirs = require(__dirname + '/lib/dirs'),
    passport      = require('passport'),
    chalk         = require('chalk'),
    async         = require('async');

// Enable terminal colors
chalk.enabled = true;

// Load configurations
// -------------------
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    lib = frameworkDirs.lib,
    middleware = frameworkDirs.middleware,
    tasks = [],
    app = express(),
    mongoose;

/**
 * Start the exponential server.
 *
 * @param {String} projectDirs Full path to the various project directories.
 *        Project directories is the directory hierarchy that contains a
 *        developer's project file, which is distinct from the Exponential
 *        framework directory structure (represented by `dirs`).
 */
function init(projectDirs) {
    'use strict';

    // Initialize the Bunyan logger
    var conf   = require(projectDirs.server + '/config')(env, projectDirs.config),
        bunyan = require('exponential-bunyan');

    bunyan.init(projectDirs);
    var log = bunyan.getLogger();

    // This prevents the output of useful error messages.
    //process.on('uncaughtException', function(err) {
    //    log.error({type: 'uncaughtException'}, err);
    //    process.exit(1);
    //});

    app.disable('x-powered-by');

    // Publish a few globals for convenience
    // -------------------------------------
    global.conf = conf;
    global.dirs = projectDirs;

    global.exponential = {
        conf: conf,
        frameworkDirs: frameworkDirs,
        projectDirs: projectDirs
    };

    if (conf.get('mongo.use')) {
        mongoose = require('mongoose');

        // Connect to MongoDB
        // ------------------
        var mongoConnect = require(lib + '/mongo-connect');
        tasks.push(mongoConnect.bind(mongoConnect, conf));

        // Load Mongoose models
        // --------------------
        var mongoLoadModels = require(lib + '/mongo-load-models');
        tasks.push(mongoLoadModels);
    }

    // Postgresql (via anyDB)
    // ----------------------
    if (conf.get('postgres.use')) {

        // Setup the Postgres driver defaults
        // ----------------------------------
        var postgresqlDefaults = require(lib + '/postgresql');
        tasks.push(postgresqlDefaults.bind(postgresqlDefaults, conf));
    }

    // Passport (authentication) setup
    // -------------------------------

    // Convenience variable for loading Passport scripts
    var passportDb = '/' + conf.get('passport.db');

    var passportSerialization = require(projectDirs.lib + passportDb + '-passport-serialization');
    tasks.push(passportSerialization);

    // Initialize Passport Local strategy
    if (conf.get('passport.local.use')) {
        var passportLocalInit = require(projectDirs.lib + passportDb + '-passport-local-init');
        tasks.push(passportLocalInit.bind(passportLocalInit, conf));
    }

    // Initialize Passport Twitter strategy
    if (conf.get('passport.twitter.use')) {
        var passportTwitterInit = require(projectDirs.lib + passportDb + '-passport-twitter-init');
        tasks.push(passportTwitterInit.bind(passportTwitterInit, conf));
    }

    // Initialize Passport Facebook strategy
    if (conf.get('passport.facebook.use')) {
        var passportFacebookInit = require(projectDirs.lib + passportDb + '-passport-facebook-init');
        tasks.push(passportFacebookInit.bind(passportFacebookInit, conf));
    }

    // Initialize Passport Github strategy
    if (conf.get('passport.github.use')) {
        var passportGitHubInit = require(projectDirs.lib + passportDb + '-passport-github-init');
        tasks.push(passportGitHubInit.bind(passportGitHubInit, conf));
    }

    // Initialize Passport Google strategy
    if (conf.get('passport.google.use')) {
        var passportGoogleInit = require(projectDirs.lib + passportDb + '-passport-google-init');
        tasks.push(passportGoogleInit.bind(passportGoogleInit, conf));
    }

    // Compression (must be before static files)
    // -----------------------------------------
    // Do not compress in Express. Instead compress with nginx or another proxy.
    // var enableCompression = require(middleware + 'compression');
    // tasks.push(enableCompression.bind(enableCompression, app, express));

    // Client-side and static files
    // -----------------------------------
    var staticFiles = require(middleware + '/static-files');
    tasks.push(staticFiles.bind(staticFiles, app, express, projectDirs));

    // Logging
    // -------

    // Don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
        var setupLogging = require(middleware + '/logging');
        tasks.push(setupLogging.bind(setupLogging, app, express));
    }

    // Template engine
    // ---------------

    // TODO: https://github.com/visionmedia/consolidate.js

    // Handlebars
    var setupHandlebars = require(lib + '/templates-handlebars');
    tasks.push(setupHandlebars.bind(setupHandlebars, app, express, projectDirs));

    // Enable jsonp
    // ------------
    var setupJsonp = require(middleware + '/jsonp');
    tasks.push(setupJsonp.bind(setupJsonp, app));

    // Cookies (must be above session)
    // -------------------------------
    var setupCookies = require(middleware + '/cookies');
    tasks.push(setupCookies.bind(setupCookies, app, express));

    // Body parsers (must be above methodOverride)
    // -------------------------------------------
    var setupBodyParsers = require(middleware + '/body-parsers');
    tasks.push(setupBodyParsers.bind(setupBodyParsers, app, express));

    // Sessions
    // --------

    // Mongo session storage
    if (conf.get('express.session.db') === 'mongo') {
        var mongoSessionStorage = require(middleware + '/sessions-mongo');
        tasks.push(mongoSessionStorage.bind(mongoSessionStorage, app, express, mongoose, conf));
    }

    // Redis session storage
    if (conf.get('express.session.db') === 'redis') {
        var redisSessionStorage = require(middleware + '/sessions-redis');
        tasks.push(redisSessionStorage.bind(redisSessionStorage, app, express, conf));
    }

    // Flash messages
    // --------------
    var flashMessages = require(middleware + '/flash-messages');
    tasks.push(flashMessages.bind(flashMessages, app));

    // Dynamic helpers
    // ---------------
    //app.use(viewHelpers(config.app.name));

    // CSRF
    // ----
    var setupCsrf = require(lib + '/csrf');
    tasks.push(setupCsrf.bind(setupCsrf, app, express));

    // Passport initialization
    // -----------------------
    var passportInit = require(middleware + '/passport-init');
    tasks.push(passportInit.bind(passportInit, app));

    // Authorization middleware
    // ---------------------------
    // Check if the user is logged in and store the result in res.locals.login
    // so that the value can be used in templates.
    var authorizationMiddleware = require(projectDirs.middleware + '/middleware-authorization');
    tasks.push(authorizationMiddleware.bind(authorizationMiddleware, app));

    // Load Express routes
    // -------------------
    var loadExpressRoutes = require(lib + '/express-load-routes');
    tasks.push(loadExpressRoutes.bind(loadExpressRoutes, app, projectDirs));

    // 404, 500 and error handling (Must be after the routes are loaded)
    // ---------------------------

    // Project-specific error responses
    var errorResp = require(projectDirs.middleware + '/error-responses');
    tasks.push(errorResp.bind(errorResp, app));

    // 50x errors
    var internalServerError = require(middleware + '/500');
    tasks.push(internalServerError.bind(internalServerError, app, conf));

    // 404 error handling function must be the last middleware function to be
    // called. This ensures that any request not handled previously will return
    // a 404 error.
    var notFoundError = require(middleware + '/404');
    tasks.push(notFoundError.bind(notFoundError, app, conf));

    // Start the app by listening on <port>
    // ------------------------------------
    function startExpress(err) {
        // unused param: results
        if (err) {
            // Display the user in the terminal in case an admin is watching and
            // also log the error.
            console.log(err);
            log.error(err);
            // Kill the process. In production, killing the process allows our
            // process monitor (ex. forever, monit, pm2) to notice the failure and
            // to handle it / restart as desired.
            process.exit(1);
        }

        var port = process.env.PORT || conf.get('express.port');
        app.listen(port);

        elapsedTime('Express started');

        var startMessage = 'Server started on port ' + port;
        console.log(chalk.blue('Exponential:'), chalk.green(startMessage));

        log.info('Started server on port ' + port);

        exports = module.exports = app;
    }

    async.series(tasks, startExpress);
}

module.exports = init;
