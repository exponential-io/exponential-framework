/**
 * Default settings for PostgreSQL. These settings are required both to connect
 * to the database, but equally important to set a sane connection pool size.
 *
 * Ref: https://github.com/brianc/node-postgres/wiki/pg#properties-defaults
 */

var pg = require('pg').native;

function postgresql(conf, callback) {
    'use strict';

    pg.defaults.poolSize = conf.get('postgres.poolSize');
    pg.defaults.host = conf.get('postgres.host');
    pg.defaults.user = conf.get('postgres.user');
    pg.defaults.password = conf.get('postgres.password');
    pg.defaults.database = conf.get('postgres.database');

    callback(null, []);
}

module.exports = postgresql;
