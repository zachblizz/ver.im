const { chatCmds, socketCmds } = require('../models')
const { getOnlineUsers } = require('../utils/utils')
const fs = require('fs')
const path = require('path')

function onNewUser({io, users, username, room} = {}) {
  if (!users[username]) { // user refreshed the browser
    users[username] = {
      username,
      loginTime: new Date()
    }
  }

  const onlineUsers = getOnlineUsers(users)
  if (room) {
    io.to(room).emit(socketCmds.sendOnlineUsers, {onlineUsers})
  } else {
    io.emit(socketCmds.sendOnlineUsers, {onlineUsers})
  }
  return users[username]
}

function onUserTyping({io, users, username, cmd, room} = {}) {
  if (room) {
    io.to(room).emit(cmd, {user: users[username]})
  } else {
    io.emit(cmd, {user: users[username]})
  }
}

function onUserDisconnect({io, currentUser, users, room} = {}) {
  console.log('client disconnected')
  if (currentUser && currentUser.username) {
    console.log(`${currentUser.username} logged out`)
    if (room) {
      io.to(room).emit(socketCmds.loggedOut, {...currentUser, msg: `${currentUser.username} logged out`})
    } else {
      io.emit(socketCmds.loggedOut, {...currentUser, msg: `${currentUser.username} logged out`})
    }
    delete users[currentUser.username]

    const onlineUsers = getOnlineUsers(users)
    if (room) {
      io.to(room).emit(socketCmds.sendOnlineUsers, {onlineUsers})
    } else {
      io.emit(socketCmds.sendOnlineUsers, {onlineUsers})
    }
  }
}

// send the object to emit
function onReceiveClientMsg({emitter, socket, msg} = {}) {
  console.log(msg)
  if (msg.msg !== '/cmds' && (!chatCmds[msg.msg] || msg.msg === '/clear')) {
    if (msg.msg !== '/clear') {
      emitter.emit(socketCmds.receiveServerMsg, msg)
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
            emitter.emit(socketCmds.receiveServerMsg, {
              ...msg,
              username: 'svr',
              msg: "doh..."
            })
          }
          emitter.emit(socketCmds.receiveServerMsg, {...msg, image: true, buffer})
        })
      } else {
        emitter.emit(socketCmds.receiveServerMsg, {
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
