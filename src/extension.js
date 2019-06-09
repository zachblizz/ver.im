const commands = require('./commands')
const { getOnlineUsers } = require('./utils')

function onNewUser({socket, users, username} = {}) {
  const onlineUsers = getOnlineUsers(users)
  socket.emit(commands.sendOnlineUsers, {onlineUsers})
  return users[username]
}

function onUserTyping({socket, users, username} = {}) {
  socket.emit(commands.typing, {user: users[username]})
}

function onUserDisconnect({socket, currentUser, users} = {}) {
  if (currentUser && currentUser.username) {
    console.log(`${currentUser.username} logged out`)
    socket.emit(commands.loggedOut, {msg: `${currentUser.username} logged out`})
    delete users[currentUser.username]

    const onlineUsers = getOnlineUsers(users)
    socket.emit(commands.sendOnlineUsers, {onlineUsers})
  }
}

module.exports = {
  onNewUser,
  onUserTyping,
  onUserDisconnect
}
