const express = require('express')
const ResponsiveController = require('../app/controllers/ResponsiveController')

const router = express.Router()

router.get('/api/responsives/:id', ResponsiveController.getOne)
router.get('/api/responsives', ResponsiveController.getAll)
router.post('/api/responsives', ResponsiveController.create)

module.exports = router
