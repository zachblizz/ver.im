const fs = require('fs')
const path = require('path')
const cmdFilePath = path.join(__dirname, 'cmds.json')

let chatCmds = loadCmds()

// loads the commands and parses the json obj
function loadCmds() {
	try {
		return JSON.parse(fs.readFileSync(cmdFilePath))
	} catch (err) {
		throw new Error('could not parse command file')
	}
}

module.exports = chatCmds
