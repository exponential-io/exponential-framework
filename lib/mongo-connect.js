var chalk    = require('chalk'),
    mongoose = require('mongoose');

function mongoConnect(conf, callback) {
    'use strict';

    mongoose.connect(conf.get('mongo.url'));
    var mongo = mongoose.connection;

    mongo.on('error', mongoConnectionError);
    mongo.once('open', mongoConnectionOpen);

    function mongoConnectionError(err) {
        console.log(
            chalk.blue('Exponential:'),
            chalk.red('Failed to connect to MongoDB')
        );
        console.log(chalk.red(err.message));

        callback(err, []);
    }

    function mongoConnectionOpen() {
        console.log(
            chalk.blue('Exponential:'),
            chalk.green('Connected to MongoDB')
        );

        //mongoLoadModels(_dir.server.models);
        callback(null, []);
    }
}

module.exports = mongoConnect;
