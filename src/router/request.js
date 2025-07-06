const express = require("express");
const requestRouter = express.Router();

requestRouter.post("/request", (req, res) => {
    const a = 9;
    console.log(a);
    res.send("request sent successfully.");
})

module.exports = { requestRouter };