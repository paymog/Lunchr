// Karma configuration
// Generated on Tue Feb 10 2015 14:37:31 GMT-0600 (CST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-socket-io/socket.js',
            'bower_components/socket.io-client/socket.io.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/lodash/dist/lodash.js',
            'bower_components/angular-google-maps/dist/angular-google-maps.js',
            'bower_components/angularjs-google-places/src/google-api.js',
            'bower_components/angularjs-google-places/src/angularjs-google-places.js',
            'bower_components/ngprogress/build/ngProgress.js',
            'public/javascripts/*.js',
            'ng_tests/**/*.js',
            'ng_tests/stateMock.js',
            'ng_tests/socketMock.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
