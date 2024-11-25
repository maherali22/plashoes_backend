const user = require("../../modles/schema/userSchema");
const joischema = require("../../modles/joischema/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const customError = require("../../utils/customError");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN);
};

// user registration
const userReg = async (req, res, next) => {
  const { value, error } = joischema.joiUserSchema.validate(req.body);
  const { name, email, number, password, confirmpassword } = value;

  if (error) {
    return next(new customError(error.details[0].message, 404));
  }

  const existUser = await user.findOne({ email });
  if (existUser) {
    return next(new customError("user already exist", 404));
  }

  if (password !== confirmpassword) {
    return res.status(404).json({
      status: "error",
      message: "password and confirm password not match",
    });
  }
  //hashed and salt password
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
  if (!userData) {
    return next(new customError("user not found", 401));
  }
  const isMatch = await bcrypt.compare(password, userData.password);
  if (!isMatch) {
    return next(new customError("password is incorrect", 401));
  }
  const token = createToken(userData._id);
  res.json({ success: true, token });
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
