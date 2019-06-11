const commands = require('./commands')
const { getOnlineUsers } = require('./utils')

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

module.exports = {
  onNewUser,
  onUserTyping,
  onUserDisconnect
}
