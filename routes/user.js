const express = require('express')
const UserController = require('../app/controllers/UserController')
const userExtractor = require('../app/middlewares/userExtractor')

const router = express.Router()

router.get('/api/users', userExtractor, UserController.getAll)
// router.post('/api/responsives', userExtractor, ResponsiveController.create)

module.exports = router
