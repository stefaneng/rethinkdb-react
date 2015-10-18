var path = require('path');

var APP = path.resolve(__dirname, 'app');

module.exports = {
  entry: path.resolve(APP, 'client.jsx'),
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: "/dist/",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css"},
      { test: /\.jsx?$/, loader: "babel", exclude: /node_modules/}
    ]
  }
};
