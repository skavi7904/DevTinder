const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/user");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { ValidateSignUpUserRequestBody } = require("./utils/validation");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    const reqBody = req.body;
    console.log(JSON.stringify(reqBody));
    ValidateSignUpUserRequestBody(reqBody);
    const userCreatedPromise = await UserModel.create(reqBody);
    res.send(userCreatedPromise);
  } catch (err) {
    res.status(400).send("CATCH: Error while signing up: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const reqBody = req.body;
    const { email, password } = reqBody;
    if(!email || !password) return res.status(400).send("Please provide creds!")
    const user = await UserModel.findOne({ email: email });
    if (user?.password === password) return res.send("Your are logged in successfully!");
    res.status(401).send("Invalid credentials!");
  } catch (err) {
    res.status(400).send("CATCH: Error while logging in: " + err.message);
  }
})

app.get("/feed", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("CATCH: Error while fetching users: " + err.message);
  }
})

app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).send("Internal Server Error: " + err.message);
});


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
