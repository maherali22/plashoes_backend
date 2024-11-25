const customError = require("../utils/customError");

const manageError = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err);

  if (err instanceof customError) {
    return res.status(err.statusCode || 400).json({
      status: "fail",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "fail",
    message: err.message || "Internal Server Error",
  });
};

module.exports = manageError;
