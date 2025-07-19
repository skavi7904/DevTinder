const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");

const {ConnectionRequestModel } = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:userId",userAuth, async (req, res) => {
    try {
        const { status, userId } = req.params;
        const isToUserExists = await UserModel.findOne({ _id: userId });
        if (!isToUserExists) return res.status(404).send("User not found");
        if (!["interested", "ignored"].includes(status)) throw new Error("status is not valid to send.");
        const existingConn = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId: req._id, toUserId: userId },
                { fromUserId: userId, toUserId: req._id}
            ]
        })
        if (existingConn) throw new Error("Request/Connection already exists");
        const newConn = await ConnectionRequestModel.create({
            fromUserId: req._id,
            toUserId: userId,
            status
        })
        res.status(201).json({ message: "Request sent", request: newConn });
    } catch (err) {
        console.error("CATCH: " + err?.message);
        res.status(400).json({ error: err?.message });
    }
})

requestRouter.post(
  "/request/received/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const isRequestExists = await ConnectionRequestModel.findOne({ _id: requestId });
      if (!isRequestExists) return res.status(404).send("Request not found");
      if (!["accepted", "rejected"].includes(status))
        throw new Error("status is not valid to send.");
      const conn = await ConnectionRequestModel.findOne({
          _id: requestId,
          toUserId: req._id,
          status: 'interested'
      });
      if (!conn) throw new Error("Request doesn't exist.");
        conn.status = status;
        const updatedConn = await conn.save();
      res.status(200).json({ message: `connection ${status}`, conn:updatedConn });
    } catch (err) {
      console.error("CATCH: " + err?.message);
      res.status(400).json({ error: err?.message });
    }
  }
);

module.exports = { requestRouter };