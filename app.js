var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var connections = [];
var users = [];


app.set('view engine', 'ejs');

app.use(express.static('./public'));

app.get('/', function(req, res){
  res.render('index')
});


io.on('connection', function(socket){

  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  socket.on('disconnect', function(data){
    if(!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected', connections.length);
  });

  socket.on('new-message', function(message){
    io.emit('receive-message', message)
    console.log(message);
  });

  socket.on('new-user', function(data, callback){
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  function updateUsernames(){
    io.sockets.emit('get-users', usernames);
  }
});

var port = process.env.PORT || 8000;

server.listen(port, function(){
  console.log('Im Up');
})
