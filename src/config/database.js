const mongoose = require("mongoose");
const connectionURI =
    "mongodb+srv://kaviyarasansoftsuave:v87Eimh2b5QAPfZp@kavicluster.x1ycl4r.mongodb.net/DevTinder";
  
const connectDB = async() => {
    return await mongoose.connect(connectionURI);   
}

module.exports = connectDB;