const express = require("express");
const tryCatch = require("../middleware/trycatch");
const userAdminController = require("../controller/admin/userAdminController");
const {
  verifyToken,
  verifyAdminToken,
} = require("../middleware/authentication");
const routes = express.Router();

routes.get(
  "/users",
  verifyToken,
  verifyAdminToken,
  tryCatch(userAdminController.getAllUsers)
);

module.exports = routes;
