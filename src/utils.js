const models = require('./models')

function getOnlineUsers() {
  const userNames = Object.keys(models.users)
  const onlineUsers = []
  userNames.forEach(name => onlineUsers.push(models.users[name]))

  return onlineUsers
}

module.exports = { getOnlineUsers }
