const User = require('../models/User')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(Number(process.env.SALT))
const jwt = require('jsonwebtoken')

class UserController {

    static getUsers(req, res) {

        User.find().select("-password")
            .then(function(users) {
                res.status(200).json({message: "success", data: users})
            })
            .catch(function(error){
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error.message
                })
            })
    }

    static createUser(req, res) {

        let hashedPassword = bcrypt.hashSync(req.body.password, salt)

        let obj = {
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        }

        User.create(obj)
            .then(function(user) {
                res.status(201).json({message: "success", data: user})
            })
            .catch(function(error){
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error.message
                })
            })
    }

    static getUserById(req, res) {

        User.findById(req.params.userId)
            .then(function(user) {
                res.status(200).json({message: "success", data: user})
            })
            .catch(function(error){
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error.message
                })
            })
    }

    static updateUserById(req, res) {

        if(req.body.password != undefined) {
            req.body.password = bcrypt.hashSync(req.body.password, salt)
        }

        User.findByIdAndUpdate(req.params.userId, req.body, {new: true})
            .then(function(user) {
                res.status(200).json({message: "success", data: user})
            })
            .catch(function(error){
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error.message
                })
            })
    }

    static deleteUserById(req, res) {

        User.findByIdAndRemove(req.params.userId)
            .then(function(user) {
                res.status(200).json({message: "success", data: user})
            })
            .catch(function(error){
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error.message
                })
            })
    }

    static getUserProfile(req, res) {
        User.findById(req.user._id).select("-password")
            .then(function(user) {
                res.status(200).json({message: "success", data: user})
            })
            .catch(function(error){
                res.status(500).json({
                    message: "Internal Server Error",
                    error: error.message
                })
            })
    }

    static loginUser(req, res) {

        User.findOne({username: req.body.username})
        .then(function (user) {
                if (user && bcrypt.compareSync(req.body.password, user.password)) {
                    let payload = {
                        _id: user._id,
                        name: user.name,
                        username: user.username,
                        role: user.role,
                        tokenType: "accessToken"
                    }

                    let payloadRefresh = {
                        _id: user._id,
                        name: user.name,
                        username: user.username,
                        role: user.role,
                        tokenType: "refreshToken"
                    }

                    let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "5m"})
                    let refreshtoken = jwt.sign(payloadRefresh, process.env.JWT_SECRET_REFRESH, {expiresIn: "1y"})
                    
                    res.header('x-auth-token', token).status(200).json({
                        message: "success",
                        data: {
                            token: token,
                            refreshToken: refreshtoken
                        }
                    })
                }
                else {
                    res.status(401).json({
                        message: "Wrong username or password",
                    })
                }
            })
            .catch(function(error) {
                res.status(500).json({
                    message: "Internal server error",
                    error: error.message
                })
            })
    }

    static refreshTokenUser(req, res) {

        let decoded = {}
        let decodedRefresh = {}

        try {
            decoded = jwt.verify(req.body.token, process.env.JWT_SECRET)
            decodedRefresh = jwt.verify(req.body.refreshtoken, process.env.JWT_SECRET_REFRESH)
        }
        catch (error) {
            res.status(400).json({
                message: "Invalid token",
                error: error.message
            })
        }

        let token = jwt.sign(decoded, process.env.JWT_SECRET, {expiresIn: "5m"})
        let refreshtoken = jwt.sign(decodedRefresh, process.env.JWT_SECRET_REFRESH, {expiresIn: "1y"})

        res.header('x-auth-token', token).status(200).json({
            message: "success",
            data: {
                token: token,
                refreshToken: refreshtoken
            }
          })
        
    }

}

module.exports = UserController