var io = require('socket.io').listen(8000);

io.sockets.on('connection', function (socket) {
  socket.on('set nickname', function (name) {
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
  });

  socket.on('putChar', function(data) {
    console.log('character data received from ' + socket.nickname + ': ' + data);
    socket.broadcast.emit('putChar', socket.nickname, data);
  })
});


