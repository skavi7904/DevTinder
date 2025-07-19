const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["accepted", "ignored", "interested", "rejected"],
            message: `{VALUE} is not a valid status`
        },
        required: true
    }
}, {
    timestamps: true,
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function () {
    if (this.fromUserId.equals(this.toUserId)) throw new Error("You can't connect with yourself!");
})

const ConnectionRequestModel = mongoose.model("connectionRequest", connectionRequestSchema);

module.exports = {ConnectionRequestModel}