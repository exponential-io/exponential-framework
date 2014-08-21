/**
 * Full path to various exponential framework directories.
 */
module.exports = (function dirs() {
    'use strict';

    var baseDir = __dirname + '/..';

    return {
        project: baseDir,
        build: baseDir + '/build',
        server: baseDir,
        lib: baseDir + '/lib',
        middleware: baseDir + '/middleware'
    };
}());
