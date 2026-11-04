const userService = require("./services/UserService");

module.exports = {
    getUserInfo: async (userId) => {
        return await userService.getUserInfo(userId);
    },
    findUserByEmail: async (email) => {
        return await userService.getUserByEmail(email);
    },
    createUser: async (userInfo) => {
        return await userService.createUser(userInfo);
    },
    getCredentialByEmail: async (email) => {
        return await userService.getUserCredential(email);
    }
}