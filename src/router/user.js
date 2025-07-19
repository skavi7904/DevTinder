const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const userRouter = express.Router();

userRouter.get("/received/requests", userAuth, async(req, res )=> {
    try {
        const receivedRequests = await ConnectionRequestModel.find({
            toUserId: req._id,
            status: 'interested'
        })
        res.json({receivedRequests});
    } catch(err) {
        res.status(400).json({error: err?.message});
    }
})

userRouter.get("/user/connections", userAuth, async(req, res)=> {
    try{
        const connections = await ConnectionRequestModel.find({
            $or: [{ fromUserId: req._id},{toUserId: req._id}],
          status: "accepted",
        });
        res.json({ connections });
    } catch(err) {
        res.status(400).json({error: err?.message});
    }
})


module.exports = {userRouter}