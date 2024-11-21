const express = require("express");
const routes = express.Router();
const tryCatch = require("../middleware/trycatch");
const loginController = require("../controller/common/loginController");

routes
  .post("/signup", tryCatch(loginController.userReg))
  .post("/login", tryCatch(loginController.userLogin))
  .post("/logout", tryCatch(loginController.userLogout));
module.exports = routes;
