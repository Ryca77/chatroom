var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = {};

io.on('connection', function (socket) {
    console.log('Client connected');
    
    //broadcast new user joining to all connected sockets
    socket.on('update', function(name) {
        users[socket.id] = name;
        socket.broadcast.emit('update', name);
    });
    
    //broadcast messages to all connected sockets
    socket.on('message', function(user, message) {
        users[socket.id] = user;
        console.log('Received message:', message);
        socket.broadcast.emit('message', user, message);
    });
    
    //broadcast user typing alert to all connected sockets except current
    socket.on('typing', function(typer) {
        users[socket.id] = typer;
        socket.broadcast.emit('typing', typer);
    });
    
    //broadcast user disconnect to all connected sockets
    /*socket.on('disconnect', function() {
        socket.broadcast.emit('update', users[socket.id]);
        delete users[socket.id];
        socket.broadcast.emit('update-users', users);
    });*/
});

server.listen(process.env.PORT || 8080);