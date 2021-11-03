const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')

router.get('/:id', basketController.get)

module.exports = router
