var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var webpackMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var r = require('rethinkdb');

var production = process.env.NODE_ENV === 'production';

app.use(express.static(__dirname + '/public'));

if (!production) {
  var compiler = webpack(config);

  app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: true,
      chunkModules: false,
      modules: true
    }
  }));

}

r.connect({ host: 'rethinkdb', port: 28015 }, function(err, conn) {
  if (err) throw err;
  console.log("Connected to rethinkdb");
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });

  socket.on('chat message', function(msg) {
    console.log("Chat message: ", msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
