/**
 * Mongo storage for Connect sessions
 */
'use strict';

function mongoSessionStorage(app, express, mongoose, conf, callback) {
    var MongoStore = require('connect-mongo')(express);

    app.use(express.session({
        secret: conf.get('express.session.secret'),
        store: new MongoStore({
            db: mongoose.connection.db,
            collection: 'sessions'
        })
    }));

    callback(null, []);
}

module.exports = mongoSessionStorage;
