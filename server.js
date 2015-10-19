var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var webpackMiddleware = require('webpack-dev-middleware');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var r = require('rethinkdb');

var production = process.env.NODE_ENV === 'production';

var rethinkdb_port = 28015;
var rethinkdb_host = process.env.RETHINKDB_HOST || 'localhost';

var createStore = require('redux').createStore;
var messageApp = require('./app/reducers').messageApp;

var store = createStore(messageApp);

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

r.connect({ host: rethinkdb_host, port: rethinkdb_port }, function(err, conn) {
  if (err) {
    console.error("Failed to connect to rethinkdb - host: ",
                  rethinkdb_host, " port: ", rethinkdb_port);
    throw err;
  }
  console.log("Connected to rethinkdb - host: ",
              rethinkdb_host, " port: ", rethinkdb_port);
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function() {
    console.log('a user disconnected');
  });

  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
    console.log("Chat message: ", msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
