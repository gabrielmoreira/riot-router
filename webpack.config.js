var webpack = require('webpack');
var plugins = [];

if (process.env.COMPRESS) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  );
}

var config = {
  output: {
    libraryTarget: "umd",
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
        cacheDirectory: true
      }
    }]
  },
  plugins: plugins
};

module.exports = config;