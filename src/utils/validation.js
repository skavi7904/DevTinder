const validator = require("validator");

const ValidateSignUpUserRequestBody = (req) => {
  const { firstName, lastName, email, password } = req;

  // Check for missing fields
  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields (firstName, lastName, email, password) are required.");
  }

  // Validate firstName
  if (
    typeof firstName !== "string" ||
    firstName.length < 3 ||
    firstName.length > 50 ||
    !/^[A-Za-z]+$/.test(firstName)
  ) {
    throw new Error("First name must be 3-50 alphabetic characters.");
  }

  // Validate lastName
  if (
    typeof lastName !== "string" ||
    lastName.length < 1 ||
    lastName.length > 50 ||
    !/^[A-Za-z]+$/.test(lastName)
  ) {
    throw new Error("Last name should be 1-50 alphabetic characters.");
  }

  // Validate email
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email address.");
  }

  // Validate password
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password should be at least 8 characters long and must contain an uppercase letter, a lowercase letter, a number, and a special character."
    );
  }
};

const validateProfileEditReqBody = (body) => {  
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "bio",
    "skills",
    "gender",
    'photoUrl',
  ];
  return Object.keys(body).every((field) => allowedEditFields.includes(field));
};

module.exports = {ValidateSignUpUserRequestBody, validateProfileEditReqBody}