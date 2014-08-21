/**
 * Grunt file for Exponential framework that performs the following tasks:
 * 1. JSCS
 * 2. JSHint
 * 3. Mocha tests
 */

module.exports = function(grunt) {
    'use strict';

    // Display time per task
    require('time-grunt')(grunt);

    // Set the path to node_modules
    process.env.NODE_PATH = __dirname + '/node_modules';

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jscs: {
            all: [
                'index.js',
                'lib/**/*.js',
                'middleware/**/*.js'
            ],
            options: {
                config: '.jscsrc'
            }
        },

        jshint: {
            all: [
                'index.js',
                'lib/**/*.js',
                'middleware/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                ignores: []
            }
        },

        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['tests/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        }
    });

    grunt.registerTask('qc', [], function() {
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-jscs');

        grunt.task.run(['jshint', 'jscs']);
    });

    grunt.registerTask('jscs', [], function() {
        grunt.loadNpmTasks('grunt-jscs');
        grunt.task.run(['jscs']);
    });

    grunt.registerTask('jshint', [], function() {
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.task.run(['jshint']);
    });

    grunt.registerTask('test', ['env:test', 'mochaTest']);
};
