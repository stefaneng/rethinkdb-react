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

  r.db('test').tableCreate('messages').run(conn, function(err, results) {
    // Create if does not exist
    if (err && err.name !== 'ReqlOpFailedError') throw err;

    console.log("Table messages create");

    r.table('messages').changes().run(conn, function(err, cursor) {
      if (err) throw err;
      cursor.each(function(err, row) {
        if (err) throw err;

        io.emit('db message', row.new_val);
        console.log(JSON.stringify(row, null, 2));
      });
    });


    // Listen to socket.io
    io.on('connection', function(socket) {
      console.log('a user connected');

      r.table('messages').orderBy('date').run(conn, function(err, cursor) {
        if (err) throw err;

        cursor.toArray(function(err, messages) {
          socket.emit('init messages', messages);
        });

      });

      socket.on('disconnect', function() {
        console.log('a user disconnected');
      });

      socket.on('chat message', function(msg) {
        r.table('messages').insert({message: msg, date: new Date()}).run(conn, function(err, _results){
          if (err) throw err;
        });
      });
    });
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
