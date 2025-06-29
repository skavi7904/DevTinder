const express = require("express");

const app = express();

const connectDB = require("./config/database");

const dbConnection = connectDB();
dbConnection
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000);
    console.log("Server started!");
  })
  .catch((error) =>
    console.error("Error in connecting to DB: " + error.message)
  );
