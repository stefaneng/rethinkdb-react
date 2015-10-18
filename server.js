var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var webpackMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var config = require('./webpack.config.js');

var production = process.env.NODE_ENV === 'production';

app.use(express.static(__dirname + '/public'));

if (!production) {
  var compiler = webpack(config);

  app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }));

//  app.use(webpackHotMiddleware(compiler));
}

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
