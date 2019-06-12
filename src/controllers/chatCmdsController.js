const models = require('../models')

function onAddCmd(req, res) {
  // TODO: write this method...
  // const cmd = req.query.cmd
  // const outcome = req.query.outcome
  // let msg

  // try {
  //   if (!cmds[cmd]) {
  //     cmds[cmd] = outcome
  //     fs.writeFileSync(cmdFilePath, JSON.stringify(cmds, null, 2))
  //     console.log('cmd saved successfully')
  //     msg = `the command '${cmd}' was added successfully`
  //   } else {
  //     msg = `The command '${cmd}' is already available. Please type "/cmds" to view a list of all available commands`
  //   }
  // } catch (err) {
  //   console.error(err)
  //   msg = `there was an error saving the command`
  // }

  res.status(500).send({msg: 'to be implemented...'})
}

module.exports = {
  get: (_, res) => res.status(200).send(models.chatCmds),
  put: onAddCmd
}
