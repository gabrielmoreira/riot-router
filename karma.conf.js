var extend = require('extend');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'riot'],
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      //'karma-chrome-launcher',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-riot'
    ],
    files: [
      'test/**/*.test.js'
    ],
    webpack: extend(require('./webpack.config'), {
      devtool: 'inline-source-map'
    }),
    webpackMiddleware: {
      noInfo: true
    },
    preprocessors: {
      'test/*.test.js': ['webpack', 'sourcemap'],
      'test/**/*.test.js': ['webpack', 'sourcemap']
    },
    browsers: [
      'PhantomJS'//,
      //'Chrome'
    ],
    reporters: ['mocha']
  });
};