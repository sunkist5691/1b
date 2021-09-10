const router = require('express').Router()
const { signup } = require('../controller/users')
const { authCheck } = require('../middleware/auth')
const { currentUser } = require('../controller/users')

router.post('/signup', signup)
router.post('/current-user', authCheck, currentUser)

module.exports = router
