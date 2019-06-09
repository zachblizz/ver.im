function getOnlineUsers(users) {
  const userNames = Object.keys(users)
  const onlineUsers = []
  userNames.forEach(name => onlineUsers.push(users[name]))

  return onlineUsers
}

module.exports = {
  getOnlineUsers
}
