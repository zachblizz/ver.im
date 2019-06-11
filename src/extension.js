const commands = require('./commands')
const { getOnlineUsers } = require('./utils')
const { getCmds } = require('./routes')
const fs = require('fs')
const path = require('path')

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
  const cmds = getCmds()

  if (msg.msg !== '/cmds' && (!cmds[msg.msg] || msg.msg === '/clear')) {
    if (msg.msg !== '/clear') {
      io.emit(commands.receiveServerMsg, msg)
    } else {
      socket.emit(commands.receiveServerMsg, msg)
    }
  } else {
    if (msg.msg === '/cmds') {
      socket.emit(commands.receiveServerMsg, {
        ...msg,
        username: 'svr',
        msg: ['COMMANDS:', ...Object.keys(cmds)],
        style: {color: '#aaa'}
      })
    } else if (cmds[msg.msg]) {
      const mimeMsg = cmds[msg.msg]

      if (mimeMsg.type === 'img') {
        fs.readFile(path.join(__dirname, mimeMsg.src), (err, buffer) => {
          if (err) {
            io.emit(commands.receiveServerMsg, {
              ...msg,
              username: 'svr',
              msg: "doh..."
            })
          }
          io.emit(commands.receiveServerMsg, {...msg, image: true, buffer})
        })
      } else {
        // need to send the cmd
        io.emit(commands.receiveServerMsg, {
          ...msg,
          username: 'svr',
          msg: mimeMsg.src,
          type: mimeMsg.type
        })
      }
    }
  }
}

module.exports = {
  onNewUser,
  onUserTyping,
  onUserDisconnect,
  onReceiveClientMsg
}
