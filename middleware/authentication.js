const jwt = require("jsonwebtoken");
const customError = require("../utils/customError");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.token;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
        if (err) {
          console.error("JWT verification error:", err.message);
          throw new customError("token is not valid", 403);
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      next(new customError("you are not authenticated", 403));
    }
  } catch (error) {
    next(new customError(error || "failed to verify authentication", 500));
  }
};

module.exports = verifyToken;
// Compare this snippet from backend/controller/user/userCartController.js:
//ncgbhfvbybhudgycfhuchfuyfyvhhfviuvnhfbhjbjhvbhfbvhhfhhrhbdhhcbbchfhbcudhchdch

