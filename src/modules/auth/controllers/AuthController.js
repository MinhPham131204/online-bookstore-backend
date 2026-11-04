const authService = require('../services/AuthService');
const JwtAuth = require('../../../shared/middlewares/jwtAuth');

class AuthController {
    //[POST] /users
    async register(req, res) {
        try {
            const result = await authService.createAccount(req, res);

            if (result.statusCode === 201) {
                res.cookie('token', JwtAuth.generateToken(result.user), {
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    path: '/'
                })

                return res.status(result.statusCode).json({ message: result.message, user: result.user });
            } else {
                return res.status(result.statusCode).json({ error: result.error });
            }
        } catch (error) {
            console.error('Error in register:', error);
            return res.status(500).json({ error: 'An error occurred while creating the account' });
        }
    }

    //[POST] /login
    async login(req, res) {
        try {
            const result = await authService.validateUser(req, res);

            if (result.statusCode === 200) {
                res.cookie('token', JwtAuth.generateToken(result.user), {
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    httpOnly: true,
                    secure: true,
                })

                res.cookie('isLoggedIn', 'true', {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: false,
                });

                return res.status(result.statusCode).json({ message: result.message });
            } else {
                return res.status(result.statusCode).json({ error: result.error });
            }
        } catch (error) {
            console.error('Error in login:', error);
            return res.status(500).json({ error: 'An error occurred while validating the user' });
        }
    }

    //[DELETE] /logout
    async logout(req, res) {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/'
            });

            res.clearCookie('isLoggedIn', {
                httpOnly: false,
                path: '/'
            });

            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error('Error in logout:', error);
            return res.status(500).json({ error: 'An error occurred while logging out' });
        }
    }
}

module.exports = new AuthController();