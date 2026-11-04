const userModule = require("../../user/");
const bcrypt = require("bcryptjs");

class AuthService {
    async createAccount(userInfo) {
        // format email & password to standard
        userInfo.email = userInfo.email.toLowerCase().trim();
        userInfo.password = userInfo.password.trim();

        // check if email already exists
        const existingUser = await userModule.findUserByEmail(userInfo.email);
        if (existingUser) {
            return { 
                error: 'Email already exists',
                statusCode: 400
            };
        }

        // check if password meets the requirements
        if (userInfo.password.length < 8) {
            return { 
                error: 'Password must be at least 8 characters long',
                statusCode: 400
            };
        }
        else if (!/[A-Z]/.test(userInfo.password)) {
            return { 
                error: 'Password must contain at least one uppercase letter',
                statusCode: 400
            };
        }
        else if (!/[a-z]/.test(userInfo.password)) {
            return { 
                error: 'Password must contain at least one lowercase letter',
                statusCode: 400
            };
        }
        else if (!/[0-9]/.test(userInfo.password)) {
            return { 
                error: 'Password must contain at least one number',
                statusCode: 400
            };
        }
        else if (!/[!@#$%^&*(),.?":{}|<>]/.test(userInfo.password)) {
            return { 
                error: 'Password must contain at least one special character',
                statusCode: 400
            };
        }

        // create new user
        userInfo.password = await bcrypt.hash(userInfo.password, 10); // hash the password before storing it in the database
        
        const newUser = await userModule.createUser(userInfo);
        return { message: 'Account created successfully', user: newUser, statusCode: 201 };
    }

    async validateUser(credentials) {
        // format email & password to standard
        credentials.email = credentials.email.toLowerCase().trim();
        credentials.password = credentials.password.trim();

        // check if email already exists
        const user = await userModule.getCredentialByEmail(credentials.email);
        if (!user) {
            return { error: 'Email not found', statusCode: 404 };
        }

        // check if password is correct
        const isMatch = await bcrypt.compare(credentials.password, user.hashPassword);
        if (!isMatch) {
            return { error: 'Invalid password', statusCode: 401 };
        }

        return { message: 'Login successful', statusCode: 200 };
    }
}

module.exports = new AuthService();