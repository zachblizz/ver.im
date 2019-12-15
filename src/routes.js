const express = require('express')
const router = new express.Router()
const { usersController, chatCmdsController, socketController } = require('./controllers')

router.put('/login', usersController.login)
router.get('/onlineUsers', usersController.get)

router.put('/addCmd', chatCmdsController.put)
router.get('/socketCmds', socketController.get)

module.exports = router
