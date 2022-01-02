const express = require('express')
const router = express.Router()

router.get('/', function(req, res) {
    res.status(200).json({message: 'Hello World!', status: 'Connected to Sejuta Cita Backend Test API '})
})

module.exports = router