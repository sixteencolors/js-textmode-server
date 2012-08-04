
express = require("express")
app = express()

app.use require('connect-assets')({ 'src': 'src', 'buildDir', 'output'})

http = require("http")
server = http.createServer(app)
io = require("socket.io").listen(server)
server.listen 8000

# routing
app.get "/", (req, res) ->
  res.sendfile __dirname + "/index.html"

usernames = {}
io.sockets.on "connection", (socket) ->
  socket.on "sendchat", (data) ->
    io.sockets.emit "updatechat", socket.username, data

  socket.on "adduser", (username) ->
    socket.username = username
    usernames[username] = username
    socket.emit "updatechat", "SERVER", "you have connected"
    socket.broadcast.emit "updatechat", "SERVER", username + " has connected"
    io.sockets.emit "updateusers", usernames

  socket.on "disconnect", ->
    delete usernames[socket.username]

    io.sockets.emit "udpateusers", usernames
    socket.broadcast.emit "updatechat", "SERVER", socket.username + " has disconnected"

  
  # socket.on('set nickname', function (name) {
  #    socket.set('nickname', name, function () { 
  #      socket.nickname = name;
  #      socket.emit('ready'); 
  #    });
  #  }); 
  #
  #  socket.on('msg', function () {
  #    socket.get('nickname', function (err, name) {
  #      console.log('Chat message by ', name);
  #      socket.broadcast.emit('join', socket.nickname);
  #    });
  #  }); 
  socket.on "putChar", (data) ->
    console.log "character data received from " + socket.nickname + ": " + data
    socket.broadcast.emit "putChar", socket.nickname, data

