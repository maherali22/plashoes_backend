const user = require("../../modles/schema/userSchema");
const joischema = require("../../modles/joischema/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// user registration
const userReg = async (req, res, next) => {
  const { value, error } = joischema.joiUserSchema.validate(req.body);
  const { name, email, number, password, confirmpassword } = value;

  if (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
  if (password !== confirmpassword) {
    return res.status(404).json({
      status: "error",
      message: "password and confirm password not match",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  const newUser = new user({
    name,
    email,
    number,
    password: hashedPassword,
  });
  await newUser.save();
  res.status(200).json({
    status: "success",
    message: "user registered successfully",
    data: newUser,
  });
};

// user login
const userLogin = async (req, res, next) => {
  const { value, error } = joischema.joiUserLogin.validate(req.body);
  const { email, password } = value;
  if (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
  const userData = await user.findOne({ email });
  res.status(200).json({
    status: "success",
    message: "user login successfully",
    data: userData,
  });
};

// user logout

const userLogout = async (req, res, next) => {
  const { value, error } = joischema.joiUserLogin.validate(req.body);
  const { email, password } = value;
  if (error) {
    return res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
  const userData = await user.findOne({ email });
  res.status(200).json({
    status: "success",
    message: "user logout successfully",
    data: userData,
  });
};
module.exports = { userReg, userLogin, userLogout };
