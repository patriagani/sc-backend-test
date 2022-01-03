const jwt = require('jsonwebtoken')

function authadmin(req, res, next) {
    const token = req.header('x-auth-token')

    if(!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.role == 'admin') {
            req.user = decoded
            next()
        }
        else {
            return res.status(403).json({
                message: 'You are not admin'
            })
        }
    }
    catch (error) {
        if (error.name == "TokenExpiredError") {
            res.status(401).json({
                message: "Access denied. Expired Token",
            })
        }
        else {
            res.status(400).json({
                message: "Invalid token",
                error: error.message
            })
        }
    }
}

module.exports = authadmin