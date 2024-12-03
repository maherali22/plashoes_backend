const user = require("../../modles/schema/userSchema");
const customError = require("../../utils/customError");
//Get all users
const getAllUsers = async (req, res, next) => {
  const users = await user.find({ isAdmin: false }).select("-password");
  res.status(200).json({ users });
};

//get single user by id
const getSingleUser = async (req, res, next) => {
  const user = await user.findById(req.params.id).select("-password");
  if (!user) {
    return next(new customError("user not found", 404));
  }
  res.status(200).json({ user });
};
//get total number of users
const getTotalUsers = async (req, res, next) => {
  const totalUsers = await user.countDocuments({ isAdmin: false });
  res.status(200).json({ totalUsers });
  if (!totalUsers) {
    return next(new customError("no users found", 404));
  }
};
//block user
const blockUser = async (req, res, next) => {
  const user = await user.findById(req.params.id);
  if (!user) {
    return next(new customError("user not found", 404));
  }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res
    .status(200)
    .json({ message: user.isBlocked ? "user blocked" : "user unblocked" });
};
//delete user
const deleteUser = async (req, res, next) => {
  const user = await user.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new customError("user not found", 404));
  }
  res.status(200).json({ message: "user deleted successfully" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  getTotalUsers,
  blockUser,
};
