const express = require('express')
const router = express.Router()
const AuthController = require('../app/controllers/AuthController')

router.post('/auth/login', AuthController.login)
router.post('/auth/logout', AuthController.logout)
router.post('/auth/sign-up', AuthController.signUp)
router.post('/auth/signup', AuthController.signup)
router.post('/auth/forgot-password', AuthController.forgotPassword)
router.post('/auth/refresh-token', AuthController.refreshToken)

module.exports = router