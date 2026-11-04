const UserModel = require('../models/UserModel');

class UserService {
  async createUser(userInfo) {
    const newUser = await UserModel.create({
      username: userInfo.name,
      email: userInfo.email,
      hashPassword: userInfo.password,
      phoneNum: userInfo.phone,
    });

    return {
      userID: newUser.userID,
      email: newUser.email
    };
  }

  async getUserCredential(email) {
    return await UserModel.findOne({
      where: { email: email },
      attributes: ['email', 'hashPassword'],
    });
  }

  async getUserByEmail(userEmail) {
    return await UserModel.findOne({
      where: { email: userEmail },
    });
  }

  async getUserInfo(userId) {
    return await UserModel.findOne({
      where: { userID: userId },
    });
  }

  async updateUserInfo(userId, newInfo) {
    const [affectedRows] = await UserModel.update(newInfo, {
      where: { userID: userId },
    });
    return affectedRows > 0; // Return true if at least one row was updated, false otherwise
  }
}

module.exports = new UserService();