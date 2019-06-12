const { chatCmds, socketCmds } = require('../models')
const { getOnlineUsers } = require('../utils/utils')
const fs = require('fs')
const path = require('path')

function onNewUser({io, users, username} = {}) {
  const onlineUsers = getOnlineUsers(users)
  io.emit(socketCmds.sendOnlineUsers, {onlineUsers})
  return users[username]
}

function onUserTyping({io, users, username, cmd} = {}) {
  io.emit(cmd, {user: users[username]})
}

function onUserDisconnect({io, currentUser, users} = {}) {
  if (currentUser && currentUser.username) {
    console.log(`${currentUser.username} logged out`)
    io.emit(socketCmds.loggedOut, {msg: `${currentUser.username} logged out`})
    delete users[currentUser.username]

    const onlineUsers = getOnlineUsers(users)
    io.emit(socketCmds.sendOnlineUsers, {onlineUsers})
  }
}

function onReceiveClientMsg({io, socket, msg}) {
  if (msg.msg !== '/cmds' && (!chatCmds[msg.msg] || msg.msg === '/clear')) {
    if (msg.msg !== '/clear') {
      io.emit(socketCmds.receiveServerMsg, msg)
    } else {
      socket.emit(socketCmds.receiveServerMsg, msg)
    }
  } else {
    if (msg.msg === '/cmds') {
      socket.emit(socketCmds.receiveServerMsg, {
        ...msg,
        username: 'svr',
        msg: ['COMMANDS:', ...Object.keys(chatCmds)],
        style: {color: '#aaa'}
      })
    } else if (chatCmds[msg.msg]) {
      const mimeMsg = chatCmds[msg.msg]

      if (mimeMsg.type === 'img') {
        fs.readFile(path.join(__dirname, '..', mimeMsg.src), (err, buffer) => {
          if (err) {
            io.emit(socketCmds.receiveServerMsg, {
              ...msg,
              username: 'svr',
              msg: "doh..."
            })
          }
          io.emit(socketCmds.receiveServerMsg, {...msg, image: true, buffer})
        })
      } else {
        // need to send the cmd
        io.emit(socketCmds.receiveServerMsg, {
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
