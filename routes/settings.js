const express = require('express')
const router = express.Router()
const SettingsController = require('../app/controllers/SettingsController')

router.get('/api/settings', SettingsController.getAll)

module.exports = router
