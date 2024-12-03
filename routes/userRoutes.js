const express = require("express");
const tryCatch = require("../middleware/trycatch");
const userProductController = require("../controller/user/userProductController");
const userCartController = require("../controller/user/userCartController");
const userWishlistController = require("../controller/user/userWishlistController");
const userOrderController = require("../controller/user/userOrderController");
const { verifyToken } = require("../middleware/authentication");
const routes = express.Router();

routes

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
  .get(
    "/order/publicKey",
    verifyToken,
    tryCatch(userOrderController.publicKeySend)
  )
  .post("/order/cod", verifyToken, tryCatch(userOrderController.orderCOD))
  .post(
    "/order/stripe/checkout",
    verifyToken,
    tryCatch(userOrderController.orderWithStripe)
  )
  .patch(
    "/order/stripe/success/:sessionId",
    verifyToken,
    tryCatch(userOrderController.stripeSuccess)
  )
  .patch(
    "/order/cancel/:orderId",
    verifyToken,
    tryCatch(userOrderController.cancelOneOrder)
  );

module.exports = routes;
