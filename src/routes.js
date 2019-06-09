const fs = require('fs')
const	path = require('path')
const cmdFilePath = path.join(__dirname, 'public', 'cmds', 'cmds.json')
const commands = require('./commands')

let cmds = loadCmds()

function onLogin(username, users) {
  let res = {}

  if (users[username]) {
    res = {
      msg: `the username '${username}' is already in use. please pick another.`,
      userAdded: false
    }
  } else if (!username || username.trim().length === 0) {
    res = {
      msg: 'please provide a username',
      userAdded: false
    }
  } else {
    const user = {
      username: username,
      loginTime: new Date()
    }

    users[username] = user
    res = {
      userAdded: true,
      user
    }
  }

  return res
}

// loads the commands and parses the json obj
function loadCmds() {
	try {
		return JSON.parse(fs.readFileSync(cmdFilePath))
	} catch (err) {
		throw new Error('could not parse command file')
	}
}

function onAddCmd(req, res) {
  const cmd = req.query.cmd
  const outcome = req.query.outcome
  let msg

  try {
    if (!cmds[cmd]) {
      cmds[cmd] = outcome
      fs.writeFileSync(cmdFilePath, JSON.stringify(cmds, null, 2))
      console.log('cmd saved successfully')
      msg = `the command '${cmd}' was added successfully`
    } else {
      msg = `The command '${cmd}' is already available. Please type "/cmds" to view a list of all available commands`
    }
  } catch (err) {
    console.error(err)
    msg = `there was an error saving the command`
  }

  res.status(200).send({msg})
}

function onGetCmds(_, res) {
  res.status(200).send(cmds)
}

function onGetSocketCmds(_, res) {
  res.status(200).send({commands})
}

module.exports = {
  onLogin,
  onAddCmd,
  onGetCmds,
  onGetSocketCmds
}