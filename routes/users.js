const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.get('/', authAdmin, UserController.getUsers)

router.post('/', authAdmin, UserController.createUser)

router.get('/profile', auth, UserController.getUserProfile)

router.get('/:userId', auth, UserController.getUserById)

router.patch('/:userId', authAdmin, UserController.updateUserById)

router.delete('/:userId', authAdmin, UserController.deleteUserById)

router.post('/login', UserController.loginUser)

router.post('/token/refresh', UserController.refreshTokenUser)


module.exports = router