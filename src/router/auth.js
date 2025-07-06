const express = require("express");
const authRouter = express.Router();
const { ValidateSignUpUserRequestBody } = require("../utils/validation");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

//signup api
authRouter.post("/signup", async (req, res) => {
  try {
    const reqBody = req.body;
    ValidateSignUpUserRequestBody(reqBody);

    const { firstName, lastName, email, password, age, skills, gender } =
      reqBody;
    passwordHash = await bcrypt.hash(password, 10);

    await UserModel.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      skills,
      gender,
    });

    res.send("Signed up successfully!");
  } catch (err) {
    res.status(400).send("CATCH: Error while signing up: " + err.message);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const reqBody = req.body;
    const { email, password } = reqBody;

    if (!email || !password)
      return res.status(400).send("Please provide creds!");

    const user = await UserModel.findOne({ email: email });
    if (!user) return res.status(400).send("User doesn't exist.");
    const isValidated = await user.validatePassword(password);
    if (!isValidated) return res.status(401).send("Invalid credentials!");

    const token = user.getJWTToken();

    res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.send("Your are logged in successfully!");
  } catch (err) {
    res.status(400).send("CATCH: Error while logging in: " + err.message);
  }
});

module.exports = { authRouter };
