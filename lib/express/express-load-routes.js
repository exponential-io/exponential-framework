var async = require('async'),
    chalk = require('chalk'),
    fs    = require('fs');

// TODO: Push these into the router files
// TODO: Push these into the router files
// TODO: Push these into the router files
var csrf     = require('../../middleware/csrf'),
    passport = require('passport');

function loadExpressRoutes(app, projectDirs, callback) {
    'use strict';

    var auth = require(projectDirs.middleware + '/authorization');

    var path = projectDirs.routers,
        routesDirs = [];

    function getRoutes(path) {
        fs.readdir(path, loadRoutes);
    }

    function loadRoutes(err, routes) {
        if (err) {
            throw err;
        }

        async.each(routes, requireRoute, handleRouteErrors);
    }

    function requireRoute(route, callback) {
        var routerPath = path + '/' + route;

        fs.stat(routerPath, fileStat);

        function fileStat(err, stats) {
            if (stats.isFile()) {
                if (/(.*)\.(js$)/.test(route)) {
                    // console.log(chalk.blue('Exponential:'),
                    //     chalk.green('Loading router'),
                    //     chalk.green(basename(routerPath)));
                    require(routerPath)(app, passport, auth, csrf);
                }
            } else if (stats.isDirectory()) {
                routesDirs.push(routerPath);
            }

            return callback(null);
        }
    }

    function handleRouteErrors(err) {
        if (err) {
            throw err;
        }

        // Iterate through the directory structure
        if (routesDirs.length) {
            getRoutes(routesDirs.shift());
        }

        console.log(
            chalk.blue('Exponential:'),
            chalk.green('Loaded routers')
        );

        callback(null, []);
    }

    // Start the process of loading routes
    getRoutes(path);
}

module.exports = loadExpressRoutes;
