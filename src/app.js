//express
const express = require("express");
//db
const connectDB = require("./config/database");
//userModel
const UserModel = require("./models/user");
//cookieParser
const cookieParser = require("cookie-parser");
//jwt
const jwt = require("jsonwebtoken");
//bcrypt-password
const bcrypt = require("bcrypt");
//validating signup req
const { ValidateSignUpUserRequestBody } = require("./utils/validation");

//express-app
const app = express();

//to get json from req
app.use(express.json());
//to retrieve cookies from req
app.use(cookieParser());

//auth-middleware for user
const {userAuth}=require("./middlewares/auth")

//signup api
app.post("/signup", async (req, res) => {
  try {
    const reqBody = req.body;
    ValidateSignUpUserRequestBody(reqBody);

    const { firstName, lastName, email, password } = reqBody;
    passwordHash = await bcrypt.hash(password, 10);

    await UserModel.create({
      firstName,
      lastName,
      email,
      password:passwordHash,
    });

    res.send("Signed up successfully!");
  } catch (err) {
    res.status(400).send("CATCH: Error while signing up: " + err.message);
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    const reqBody = req.body;
    const { email, password } = reqBody;

    if (!email || !password) return res.status(400).send("Please provide creds!")
    
    const user = await UserModel.findOne({ email: email });
    if (!user.validatePassword(password)) res.status(401).send("Invalid credentials!");

    const token = user.getJWTToken();

    res.cookie("token", token, {maxAge: 7 * 24 * 60 * 60 * 1000});
    res.send("Your are logged in successfully!"); 
    
  } catch (err) {
    res.status(400).send("CATCH: Error while logging in: " + err.message);
  }
})

//feed api
app.get("/feed",userAuth, async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("CATCH: Error while fetching users: " + err.message);
  }
})

//error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).send("Internal Server Error: " + err.message);
});

//db and app launch
connectDB()
  .then(() => {
    console.log("Database connection successful");
    app.listen(7777, (err) => {
      if (err) console.log("Error starting server: " + err.message);
      else console.log("Server is running at port 7777!");
    });
  })
  .catch((error) =>
    console.error("Error in connecting to DB: " + error.message)
  );
