var express = require('express');
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8000);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var usernames = {};

io.sockets.on('connection', function (socket) {
  socket.on('sendchat', function(data) {
    io.sockets.emit('updatechat', socket.username, data);
  })

  socket.on('adduser', function(username) {
    socket.username = username;
    usernames[username] = username;
    socket.emit('updatechat', 'SERVER', 'you have connected');
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    io.sockets.emit('updateusers', usernames);
  })

  socket.on('disconnect', function() {
    delete usernames[socket.username];
    io.sockets.emit('udpateusers', usernames);
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });

  /* socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () { 
      socket.nickname = name;
      socket.emit('ready'); 
    });
  }); 

  socket.on('msg', function () {
    socket.get('nickname', function (err, name) {
      console.log('Chat message by ', name);
      socket.broadcast.emit('join', socket.nickname);
    });
  }); */

  socket.on('putChar', function(data) {
    console.log('character data received from ' + socket.nickname + ': ' + data);
    socket.broadcast.emit('putChar', socket.nickname, data);
  })
});


