/**
 * Redis storage for Connect sessions
 */
var redis      = require('redis').createClient(),
    session    = require('express-session'),
    RedisStore = require('connect-redis')(session);

function redisSessionStorage(app, express, conf, callback) {
    'use strict';

    redis.on('error', function(err) {
        console.log('Redis error: ' + err);
    });

    app.use(session({
        resave: true,
        saveUninitialized: true,
        secret: conf.get('express.session.secret'),
        store: new RedisStore({
            client: redis,
            host: '127.0.0.1',
            port: 6379 //,
//            ttl: '',
//            db: '',
//            pass: '',
//            collection: 'sessions'
        })
    }));

    callback(null, []);
}

module.exports = redisSessionStorage;
