const express = require("express");
const routes = express.Router();
const tryCatch = require("../middleware/trycatch");
const loginController = require("../controller/common/loginController");
const userProductController = require("../controller/user/userProductController");

routes
  //user registration and login

  .post("/signup", tryCatch(loginController.userReg))
  .post("/login", tryCatch(loginController.userLogin))
  .post("/logout", tryCatch(loginController.userLogout))

  //product Controller
  .get("/product", tryCatch(userProductController.getAllProduct))
  .get("/productid/:id", tryCatch(userProductController.getProductById))
  .get("/product/:type", tryCatch(userProductController.getProductType));

module.exports = routes;
