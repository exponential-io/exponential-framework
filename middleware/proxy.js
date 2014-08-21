// TODO: SETUP AN EXAMPLE WITH A PROXY.
// Current not configured.

'use strict';

var proxy = require('json-proxy');

function setupProxy(app, callback) {
    // configuration 1
    //Uncomment proxy below and customize to your environment to support
    //non-Node servers
    app.use(proxy.initialize({
        proxy: {
            forward: {
                '/api/v1/companies': 'http://localhost:3333',
                '/channel': 'http://www.youtube.com'
            }
        }
    }));

    // configuration 2

    app.use(proxy.initialize({
        server: {
            html5mode: true
        },
        proxy: {
            forward: {
                '/api/v1/companies': 'http://localhost:3333'
            }
        }
    }));

    app.use(proxy.initialize({
        proxy: {
            forward: {
                '/channel': 'http://www.youtube.com'
            }
        }
    }));

    callback(null, []);
}

module.exports = setupProxy;
