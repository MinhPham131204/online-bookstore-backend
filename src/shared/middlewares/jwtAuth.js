const jwt = require('jsonwebtoken')

class JwtAuth {
    static generateToken(payload) {
        // Implementation for generating JWT token
        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" })
    }

    static verifyToken(req, res, next) {
        try {
            let decodedInfo;

            if(req.cookies.token) decodedInfo = jwt.verify(req.cookies.token, process.env.SECRET_KEY)

            if(decodedInfo && decodedInfo.userID){
                req.user = decodedInfo.userID
                console.log(req.user)
                next()
            }

            else{
                console.log(decodedInfo)
                res.json('Verify error')
            }
        }
        catch(err){
            console.log(err)
        }
    }

    static requireLogin(req, res, next) {
        if (req.cookies.token) {
            next();
        }

        else res.redirect('/login')
    }
}

module.exports = JwtAuth