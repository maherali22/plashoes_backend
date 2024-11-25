const express = require("express");
const routes = express.Router();
const tryCatch = require("../middleware/trycatch");
const loginController = require("../controller/common/authController");
const userProductController = require("../controller/user/userProductController");
const userCartController = require("../controller/user/userCartController");
const userWishlistController = require("../controller/user/userWishlistController");
const verifyToken = require("../middleware/authentication");

routes
  //user registration and login

  .post("/signup", tryCatch(loginController.userReg))
  .post("/login", tryCatch(loginController.userLogin))
  .post("/logout", tryCatch(loginController.userLogout))

  //product Controller
  .get("/product", tryCatch(userProductController.getAllProduct))
  .get("/productid/:id", tryCatch(userProductController.getProductById))
  .get("/product/:type", tryCatch(userProductController.getProductType))

  //cart controller
  .get("/cart", verifyToken, tryCatch(userCartController.getUserCart))
  .post("/cart", verifyToken, tryCatch(userCartController.updateUserCart))
  .delete("/cart", verifyToken, tryCatch(userCartController.removeFromCart))

  //wishlist controller
  .get(
    "/wishlist",
    verifyToken,
    tryCatch(userWishlistController.getUserWishlist)
  )
  .post(
    "/wishlist",
    verifyToken,
    tryCatch(userWishlistController.addToWishlist)
  )
  .delete(
    "/wishlist",
    verifyToken,
    tryCatch(userWishlistController.removeFromWishlist)
  );

module.exports = routes;
