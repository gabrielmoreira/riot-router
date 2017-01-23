var webpack = require('webpack');
var configs = [];
var config = {
  entry: {
    'router': __dirname + '/router.js',
    'router.core': __dirname + '/router.core.js'
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: '[name].js',
    library: 'Router',
    libraryTarget: "umd"
  },
  externals: {
    "riot": "riot"
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
        cacheDirectory: true
      }
    }]
  },
  plugins: []
};
if (!process.env.DISABLE_SOURCEMAP) {
  config.devtool = 'source-map';
}
configs.push(config);

if (process.env.COMPRESS) {
  var extend = require('extend');
  var newConfig = extend(true, {}, config);
  newConfig.output.filename = '[name].min.js';
  newConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
  configs.push(newConfig);
}

module.exports = (configs.length > 1) ? configs : config;
