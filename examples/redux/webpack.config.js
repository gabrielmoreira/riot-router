var webpack = require('webpack');
var plugins = [
  new webpack.ProvidePlugin({
    'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
  })
];

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
   entry: {
      app: "./src/app.js"
   },
   output: {
      path: './public/build',
      publicPath: '/build/',
      filename: "[name].js",
      libraryTarget: "umd"
   },
   module: {
      preLoaders: [
         {test: /\.tag$/, exclude: /(node_modules|bower_components)/, loader: 'tag', query: {compact: 'true'} },
      ],
      loaders: [
         // JS & JSX
         {test: /\.jsx?|\.tag$/, exclude: /node_modules/, loader: 'babel-loader', query: {loose:["es6.classes", "es6.properties.computed"]}},

         // JSON
         {test: /\.json$/, exclude: /(node_modules|bower_components)/, loader: 'json'},
      ]
   },
   plugins: plugins,
   externals: {
   },
}

module.exports = config;
