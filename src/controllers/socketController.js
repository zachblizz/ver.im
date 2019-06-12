const { users, socketCmds } = require('../models')
const {
	onNewUser,
	onUserDisconnect,
	onUserTyping,
	onReceiveClientMsg
} = require('../utils/socket-extension')

function socketController(io) {
  io.on('connection', function (socket) {
    let currentUser = {}
    socket.on(socketCmds.newUser, ({username}) => {
      currentUser = onNewUser({io, users, username})
    })
    socket.on(socketCmds.receiveClientMsg, msg => onReceiveClientMsg({io, socket, msg}))
    socket.on(socketCmds.typing, ({username}) => onUserTyping({io, users, username, cmd: socketCmds.typing}))
    socket.on(socketCmds.doneTyping, ({username}) => onUserTyping({io, users, username, cmd: socketCmds.doneTyping}))
    socket.on('disconnect', () => onUserDisconnect({io, currentUser, users}))
  })
}

module.exports = {
  get: (_, res) => res.status(200).send({commands: socketCmds}),
  socketController
}
