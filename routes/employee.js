const express = require('express')
const router = express.Router()
const EmployeeController = require('../app/controllers/EmployeeController')
const userExtractor = require('../app/middlewares/userExtractor')

router.get('/api/employees', EmployeeController.getAll)
router.get('/api/employees/:employee_number', EmployeeController.getOne)

module.exports = router
