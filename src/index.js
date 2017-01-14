var express = require('express'),
	app = express(),
	path = require('path'),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	bodyparser = require('body-parser'),
	fs = require('fs');

app.use(express.static(path.join(__dirname,'public')));
app.use(bodyparser.json());

var users = {};
var online = [];
var cmdFilePath = '/Users/jimmyfargo/Dev/nodeStuff/ver.im/src/public/cmds/cmds.json'
var cmds = loadCmds();

// loads the commands and parses the json obj
function loadCmds() {
	return JSON.parse(fs.readFileSync(cmdFilePath));
}

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

// saves the command
app.get('/addCmd', function(req, res) {
	var cmd = req.query.cmd;
	var outcome = req.query.outcome;
	var msg;

	if (!cmds[cmd]) {
		cmds[cmd] = outcome;
		fs.writeFile(cmdFilePath, JSON.stringify(cmds, null, 2), function(err) {
			if (err) {
				console.log('there was an error writing to cmd file', e)
				msg = 'there was an error while saving the command'
			} else {
				console.log('cmd saved successfully')
				msg = 'the command ' + cmd + ' was added successfully'
			}
		});
	} else {
		msg = cmd + ' is already available. please type "/cmds" to view a list of all available commands'
	}
	res.json({ saved: msg })
})

app.get('/cmds', function(req, res) {
	res.json(cmds)
})

http.listen(3000, function() {
	console.log('listening on port 3090');
});