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
    socket.on(socketCmds.receiveClientMsg, msg => 
      onReceiveClientMsg({io, socket, msg, chatCmd: socketCmds.receiveServerMsg})
    )
    socket.on(socketCmds.typing, ({username}) => 
      onUserTyping({io, users, username, cmd: socketCmds.typing})
    )
    socket.on(socketCmds.doneTyping, ({username}) => 
      onUserTyping({io, users, username, cmd: socketCmds.doneTyping})
    )
    socket.on('disconnect', () => onUserDisconnect({io, currentUser, users}))

    // Private room stuff...
    socket.on(socketCmds.leaveRoom, ({room}) => socket.leave(`/${room}`))
    socket.on(socketCmds.startPrivateChat, data => {
      console.log(`${currentUser.username} joining room ${data.room}`)
      const room = `/${data.room}`
      socket.join(room)

      if (data.requester) {
        io.emit(socketCmds.askToJoin, data)
      }

      socket.to(room).on(socketCmds.chatReceiveClientMsg, ({ room, msg }) => {
        console.log('in the room receieve...', room)
        onReceiveClientMsg({io, socket, msg, room, chatCmd: socketCmds.chatReceiveServerMsg})
      })
      socket.to(room).on(socketCmds.typing, ({username}) => 
        onUserTyping({io, users, username, cmd: socketCmds.typing})
      )
      socket.to(room).on(socketCmds.doneTyping, ({username}) => 
        onUserTyping({io, users, username, cmd: socketCmds.doneTyping})
      )
    })
  })
}

module.exports = {
  get: (_, res) => res.status(200).send({commands: socketCmds}),
  socketController
}
