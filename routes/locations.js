const express = require('express')
const router = express.Router()
const LocationController = require('../app/controllers/LocationController')

router.get('/api/locations', LocationController.getAll)

module.exports = router
