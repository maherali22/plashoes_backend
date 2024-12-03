const express = require("express");
const tryCatch = require("../middleware/trycatch");
const userAdminController = require("../controller/admin/userAdminController");
const cartAdminController = require("../controller/admin/cartAdminController");
const productAdminController = require("../controller/admin/productAdminController");
const upload = require("../middleware/multer");

const {
  verifyToken,
  verifyAdminToken,
} = require("../middleware/authentication");
const routes = express.Router();

routes

  // admin user routes
  .get(
    "/users",
    verifyToken,
    verifyAdminToken,
    tryCatch(userAdminController.getAllUsers)
  )
  .get(
    "/user/:id",
    verifyToken,
    verifyAdminToken,
    tryCatch(userAdminController.getSingleUser)
  )
  .get(
    "/user-total",
    verifyToken,
    verifyAdminToken,
    tryCatch(userAdminController.getTotalUsers)
  )
  .patch(
    "/user-block/:id",
    verifyToken,
    verifyAdminToken,
    tryCatch(userAdminController.blockUser)
  )
  .delete(
    "/user-delete/:id",
    verifyToken,
    verifyAdminToken,
    tryCatch(userAdminController.deleteUser)
  )
  //admin cart routes
  .get(
    "/carts",
    verifyToken,
    verifyAdminToken,
    tryCatch(cartAdminController.getAllCarts)
  )
  .get(
    "/cart/:id",
    verifyToken,
    verifyAdminToken,
    tryCatch(cartAdminController.getSingleCartById)
  )
  //admin product routes
  .get(
    "/products",
    verifyToken,
    verifyAdminToken,
    productAdminController.getAllProducts
  )
  .get(
    "/product/:id",
    verifyToken,
    verifyAdminToken,
    productAdminController.getSingleProduct
  )
  .get(
    "/products/category/:type",
    verifyToken,
    verifyAdminToken,
    productAdminController.getProductByCategory
  )
  .post(
    "/product/create",
    verifyToken,
    verifyAdminToken,
    upload.single("image"),
    tryCatch(productAdminController.createProduct)
  )
  .put(
    "/product/update/:id",
    verifyToken,
    verifyAdminToken,
    upload.single("image"),
    tryCatch(productAdminController.updateProduct)
  )
  .patch(
    "/product/bin/:id",
    verifyToken,
    verifyAdminToken,
    tryCatch(productAdminController.deleteProduct)
  )
  .delete(
    "/product/delete/:id",
    verifyToken,
    verifyAdminToken,
    tryCatch(productAdminController.deleteProductfromBin)
  );
//admin order routes

module.exports = routes;
