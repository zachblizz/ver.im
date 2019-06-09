const express = require('express')
const app = express()
const cors = require('cors')
const	http = require('http').Server(app)
const	io = require('socket.io')(http)
const	bodyparser = require('body-parser')
const commands = require('./commands')
const { onLogin, onAddCmd, onGetCmds, onGetSocketCmds } = require('./routes')
const {
	onNewUser,
	onUserDisconnect,
	onUserTyping
} = require('./extension')
const { getOnlineUsers } = require('./utils')

let users = {}

// app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.json())
app.use(cors())

app.put('/login', (req, res) => {
  const username = req.body.username
	const loggedInResp = onLogin(username, users)
	if (!loggedInResp.userAdded) {
		res.status(500).send(loggedInResp)
	}
	res.status(200).send(loggedInResp)
})
app.get('/addCmd', onAddCmd)
app.get('/getCmds', onGetCmds)
app.get('/socketCmds', onGetSocketCmds)
app.get('/onlineUsers', (_, res) => res.status(200).send({ users: getOnlineUsers(users) }))

io.on('connection', function(socket) {
	let currentUser = {}
	socket.on(commands.newUser, ({username}) => {
		currentUser = onNewUser({socket, users, username})
	})
	socket.on(commands.receiveClientMsg, msg => socket.emit(commands.receiveServerMsg, msg))
	socket.on(commands.typing, ({username}) => onUserTyping({socket, users, username}))
	socket.on('disconnect', () => onUserDisconnect({socket, currentUser, users}))
})

http.listen(3000, function() {
	console.log('listening on port 3000')
})
