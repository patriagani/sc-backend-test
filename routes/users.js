const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const auth = require('../middlewares/auth')
const authAdmin = require('../middlewares/authAdmin')

router.get('/', authAdmin, UserController.getUsers)

router.post('/', authAdmin, UserController.createUser)


/**
 * @swagger
 * path:
 * /users/profile:
 *  get:
 *    summary: Returns a object of authenticated user.
 *    description: Get object of authenticated user.
 *    security:
 *      - accessToken: []
 *    responses:
 *      '200':
 *        description: A JSON of user object
 *        content:
 *          application/json:
 *            schema: 
 *              type: object
 *              items: 
 *                type: string
 *      '400':
 *         description: Invalid token
 *      '401':
 *         description: No token provided / expired token
 *      '403':
 *         description: Forbidden (not admin)
 *      '500':
 *         description: Internal server error 
 * 
 */
router.get('/profile', auth, UserController.getUserProfile) //all

router.get('/:userId', auth, UserController.getUserById) //all

router.patch('/:userId', authAdmin, UserController.updateUserById) //admin

router.delete('/:userId', authAdmin, UserController.deleteUserById) //admin

router.post('/login', UserController.loginUser) //all

router.post('/token/refresh', auth, UserController.refreshTokenUser) //all


module.exports = router