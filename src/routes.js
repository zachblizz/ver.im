const routes = require('express')()
const { usersController, chatCmdsController, socketController } = require('./controllers')

routes.put('/login', usersController.login)
routes.get('/onlineUsers', usersController.get)
routes.get('/getCmds', chatCmdsController.get)
routes.put('/addCmd', chatCmdsController.put)
routes.get('/socketCmds', socketController.get)

module.exports = routes
