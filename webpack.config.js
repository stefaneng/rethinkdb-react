var path = require('path');

var APP = path.resolve(__dirname, 'app');

process.env.BABEL_ENV = process.env.npm_lifecycle_event;

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
      { test: /\.jsx?$/, loader: "babel?optional[]=runtime&stage=0", exclude: /node_modules/}
    ]
  }
};
