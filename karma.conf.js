var extend = require('extend');

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-webpack',
      'karma-sourcemap-loader'
    ],
    files: [
      'test/support/function-bind.js',
      'test/**/*.test.js'
    ],
    webpack: extend(require('./webpack.config'), {
      devtool: 'inline-source-map',
      externals: {}
    }),
    webpackMiddleware: {
      noInfo: true
    },
    preprocessors: {
      'test/*.test.js': ['webpack', 'sourcemap'],
      'test/**/*.test.js': ['webpack', 'sourcemap']
    },
    browsers: [
      'PhantomJS'
    ],
    reporters: ['mocha']
  });
};
