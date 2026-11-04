const UserService = require("../services/UserService");

class UserController {
  //[GET] /user/info
  async showInfo(req, res) {
    try {
      const info = await UserService.getUserInfo(req.user);
      if (info) {
        res.status(200).json(info);
      }
      else {
        return res.status(404).json({ error: "User not found" });
      }
    } catch (err) {
      console.error('Error in showInfo:', err);
      res.status(500).json("Server error");
    }
  }

  //[PUT] /user/info/edit
  async changeInfo(req, res) {
    try {
      const isUpdated = await UserService.updateUserInfo(req.user, req.body);
    
      if (isUpdated) {
        res.status(200).json({ message: "User information updated successfully" });
      }
      else {
        return res.status(409).json({ error: "Failed to update user information" });
      }

    } catch (err) {
      console.error('Error in changeInfo:', err);
      res.status(500).json("Server error");
    }
  }
}

module.exports = new UserController();