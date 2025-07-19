const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const userRouter = express.Router();

const showableFields = ['firstName','lastName','email','age','bio','skills','gender','photoUrl']

userRouter.get("/received/requests", userAuth, async(req, res )=> {
    try {
        const receivedRequests = await ConnectionRequestModel.find({
            toUserId: req._id,
            status: 'interested'
        }).populate("fromUserId",showableFields)
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
        }).populate("fromUserId", showableFields.join(" ")).populate("toUserId", showableFields.join(" "));
        const correctConnectionResults = connections.map((connection) => {
            if (String(connection.fromUserId._id)===(req._id)) return connection.toUserId;
            return connection.fromUserId;
        })
        res.json({ connections: correctConnectionResults });
    } catch(err) {
        res.status(400).json({error: err?.message});
    }
})


module.exports = {userRouter}