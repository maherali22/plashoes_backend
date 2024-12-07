const user = require("../../modles/schema/userSchema");
const joischema = require("../../modles/joischema/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const customError = require("../../utils/customError");

const createToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_TOKEN, {
    expiresIn: "7d",
  });
};

// Create refresh token
const createRefreshToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "14d",
  });
};
const createRefreshToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "14d",
  });
};


// user registration
const userReg = async (req, res, next) => {
  //validate request data
  const { value, error } = joischema.joiUserSchema.validate(req.body);

  if (error) {
    return next(new customError(error.details[0].message, 400));
  }

  const { name, email, number, password, confirmpassword } = value;
  //check if user already exist
  const existUser = await user.findOne({ email });
  if (existUser) {
    return next(new customError("user already exist", 400));
  }
  //check if password and confirm password match
  if (password !== confirmpassword) {
    return next(new customError("Passwords do not match", 400));
  }
  //hashed and salt password
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);
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
  //validate request data
  const { value, error } = joischema.joiUserLogin.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { email, password } = value;
  //check if user exist
  const userData = await user.findOne({ email });
  if (!userData) {
    return next(new customError("user not found", 404));
  }
  //check if user is blocked
  if (userData.isBlocked) {
    return next(new customError("user is blocked", 403));
  }
  //check if user is admin
  if (userData.isAdmin) {
    return next(
      new customError(
        "access denied please use another eamil, this eamil already taken ",
        403
      )
    );
  }
  //check if password is correct
  const isMatch = await bcrypt.compare(password, userData.password);
  if (!isMatch) {
    return next(new customError("password is incorrect", 401));
  }
  const token = createToken(userData._id, userData.isAdmin);
  const refreshToken = createRefreshToken(userData._id, userData.isAdmin);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "user logged in successfully",
    isAdmin: userData.isAdmin,
    token,
  });
};

const adminLogin = async (req, res, next) => {
  //validate request data
  const { value, error } = joischema.joiUserLogin.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
    });
  }

  const { email, password } = value;
  //check if admin exist
  const adminData = await user.findOne({ email, isAdmin: true });
  if (!adminData) {
    return next(new customError("admin not found or unauthorized", 404));
  }

  const isMatch = await bcrypt.compare(password, adminData.password);
  if (!isMatch) {
    return next(new customError("password is incorrect", 401));
  }
  const token = createToken(adminData._id, adminData.isAdmin);
  const refreshToken = createRefreshToken(adminData._id, adminData.isAdmin);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "admin logged in successfully",
    token,
  });
};

const userLogout = async (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  });

  res.status(200).json({
    message: "logged out successfully",
  });
};

module.exports = { userReg, userLogin, adminLogin, userLogout };
