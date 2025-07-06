const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const UserModel = require("../models/user")


//feed api
profileRouter.get("/feed",userAuth, async (req, res) => {
    try {
      const users = await UserModel.find({});
      res.send(users);
    } catch (err) {
      res.status(400).send("CATCH: Error while fetching users: " + err.message);
    }
  })
  
  profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      const profile = await UserModel.findById({ _id: req._id });
      res.send(profile);
    } catch (err) {
      res.status(500).send("Error in getting user' profile")
    }
  })
  
module.exports = { profileRouter };