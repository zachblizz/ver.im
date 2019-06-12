const models = require('../models')
const { getOnlineUsers } = require('../utils')

function onLogin(username) {
  let res = {}

  if (models.users[username]) {
    res = {
      userAdded: false,
      msg: `the username '${username}' is already in use. please pick another.`,
    }
  } else if (!username || username.trim().length === 0) {
    res = {
      userAdded: false,
      msg: 'please provide a username',
    }
  } else {
    const user = {
      username: username,
      loginTime: new Date()
    }

    models.users[username] = user
    res = {
      userAdded: true,
      user
    }
  }

  return res
}

const usersController = {
  login: (req, res) => {
    const username = req.body.username
    const loggedInResp = onLogin(username)
    if (!loggedInResp.userAdded) {
      res.status(500).send(loggedInResp)
    }
    res.status(200).send(loggedInResp)
  },
  get: (_, res) => res.status(200).send({ users: getOnlineUsers() })
}

module.exports = usersController
