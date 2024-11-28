const express = require("express");
const tryCatch = require("../middleware/trycatch");
const loginController = require("../controller/common/authController");
const userProductController = require("../controller/user/userProductController");
const userCartController = require("../controller/user/userCartController");
const userWishlistController = require("../controller/user/userWishlistController");
const userOrderController = require("../controller/user/userOrderController");
const verifyToken = require("../middleware/authentication");
const routes = express.Router();

routes
  //user registration and login

  .post("/signup", tryCatch(loginController.userReg))
  .post("/login", tryCatch(loginController.userLogin))
  

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
  )

  // order controller

  .get("/order", verifyToken, tryCatch(userOrderController.getAllOrders))
  .get(
    "/order/:orderId",
    verifyToken,
    tryCatch(userOrderController.getOneOrder)
  )
  .post("/order", verifyToken, tryCatch(userOrderController.orderCOD))
  .patch(
    "/order/cancel/:orderId",
    verifyToken,
    tryCatch(userOrderController.cancelOneOrder)
  );

module.exports = routes;
