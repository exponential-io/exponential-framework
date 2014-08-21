'use strict';

var async = require('async'),
    dirs  = require(__dirname + '/../../lib/dirs'),
    chalk = require('chalk'),
    fs    = require('fs');

function mongoLoadModels(callback) {
    var path = dirs.models;

    fs.readdir(path, loadModels);

    function loadModels(err, models) {
        if (err) {
            throw err;
        }

        async.each(models, requireModel, handleModelErrors);
    }

    function requireModel(model, cb) {
        var newPath = path + '/' + model;

        //var stat = fs.statSync(newPath);
        fs.stat(newPath, fileStat);

        function fileStat(err, stats) {
            if (stats.isFile()) {
                if (/(.*)\.(js$|coffee$)/.test(model)) {
                    require(newPath);
                }
            } else if (stats.isDirectory()) {
                mongoLoadModels(newPath);
            }

            return cb(null);
        }
    }

    function handleModelErrors(err) {
        if (err) {
            throw err;
        }

        console.log(
            chalk.blue('Exponential:'),
            chalk.green('Loaded Mongoose models')
        );

        callback(null, []);
    }
}

module.exports = mongoLoadModels;
