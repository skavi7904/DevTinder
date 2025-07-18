const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLength: 50,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("e-mail id should be valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password should be at least 8 characters long and must contain an uppercase letter, a lowercase letter, a number, and a special character."
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    bio: {
      type: String,
      default: "Hi there, I am using DevTinder!",
    },
    skills: {
      type: [String],
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female"].includes(value.toLowerCase())) {
          throw new Error("Gender should be valid!");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if(!validator.isURL(value)){throw new Error("Photo url should be valid.")}
      }
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = async function (inputPassword) {
  const success = await bcrypt.compare(inputPassword, this.password);
  return success;
}

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ _id: this._id }, "JWTPRIVATEKEY",{expiresIn: '7d'});
}

module.exports = mongoose.model("User", userSchema);
