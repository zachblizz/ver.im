var express = require('express'),
	app = express(),
	path = require('path'),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app.use(express.static(path.join(__dirname,'public')));

var users = {};
var online = [];

io.on('connection', function(socket) {
	console.log('a user connected');

	socket.on('chat message', function(msg, name) {
		online.push(name)
		io.emit('chat message', msg, name, online)
	});

	socket.on('typing', function(name) {
		io.emit('typing', name);
	});

	socket.on('disconnect', function() {
		// TODO: find out how to get the username
		// 		 of the user who disconnected
	    console.log('a user disconnected')
	});

	socket.on('login', function(uname) {
		users[uname] = uname
		io.emit('login', 'msg.html?uname=' + uname)
		io.emit('loggedin', users)
	});
});

http.listen(3000, function() {
	console.log('listening on port 3090');
});