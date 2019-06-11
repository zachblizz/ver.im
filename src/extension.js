const commands = require('./commands')
const { getOnlineUsers } = require('./utils')
const { getCmds } = require('./routes')

function onNewUser({io, users, username} = {}) {
  const onlineUsers = getOnlineUsers(users)
  io.emit(commands.sendOnlineUsers, {onlineUsers})
  return users[username]
}

function onUserTyping({io, users, username, cmd} = {}) {
  io.emit(cmd, {user: users[username]})
}

function onUserDisconnect({io, currentUser, users} = {}) {
  if (currentUser && currentUser.username) {
    console.log(`${currentUser.username} logged out`)
    io.emit(commands.loggedOut, {msg: `${currentUser.username} logged out`})
    delete users[currentUser.username]

    const onlineUsers = getOnlineUsers(users)
    io.emit(commands.sendOnlineUsers, {onlineUsers})
  }
}

function onReceiveClientMsg({io, socket, msg}) {
  if (msg.msg !== '/cmds') {
    io.emit(commands.receiveServerMsg, msg)
  } else {
    const cmds = getCmds()

    socket.emit(commands.receiveServerMsg, {
      ...msg,
      username: 'svr',
      msg: ['COMMANDS:', ...Object.keys(cmds)],
      style: {color: '#aaa'}
    })
  }
}

module.exports = {
  onNewUser,
  onUserTyping,
  onUserDisconnect,
  onReceiveClientMsg
}
