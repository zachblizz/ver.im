const express = require('express')
const app = express()
const cors = require('cors')
const	http = require('http').Server(app)
const	io = require('socket.io')(http)
const	bodyparser = require('body-parser')
const routes = require('./routes')
const { socketController } = require('./controllers/socketController')

// app.use(express.static(path.join(__dirname, 'pics')))
app.use(bodyparser.json())
app.use(cors())
app.use('/api', routes)
socketController(io)

http.listen(3000, function() {
	console.log('listening on port 3000')
})
