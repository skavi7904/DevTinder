const jwt = require("jsonwebtoken");

const UserModel = require("../models/user")

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(400).send("token must be provided.");
  const { _id } = jwt.verify(token, "JWTPRIVATEKEY");
  if (!(await UserModel.find({ _id: _id }))) {
    return res.status(401).send("Not Accessible, need valid token!");
  }
    req._id = _id;
    next();
};

module.exports = {userAuth}