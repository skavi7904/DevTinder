const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")
const UserModel = require("../models/user")
const { validateProfileEditReqBody } = require("../utils/validation")


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

  profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
      if(!validateProfileEditReqBody(req.body)) throw new Error("Req body contains invalid fields.")
        const updatedUser = await UserModel.findByIdAndUpdate(
          req._id,
          req.body,
          { new: true, runValidators: true }
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(500).send("Error in getting user' profile: "+err.message);
    }
  });


  
module.exports = { profileRouter };