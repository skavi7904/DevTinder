//express
const express = require("express");
//db
const connectDB = require("./config/database");

//cookieParser
const cookieParser = require("cookie-parser");

//express-app
const app = express();

//to get json from req
app.use(express.json());
//to retrieve cookies from req
app.use(cookieParser());

const { authRouter } = require("./router/auth");
const { profileRouter } = require("./router/profile");
const { requestRouter } = require("./router/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

//error handling middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);
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
