
function compression(app, express, callback) {
    'use strict';

    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    callback(null, []);
}

module.exports = compression;
