require("dotenv").config();
const manageError = require("./middleware/manageError");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const app = express();

//Middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
//Routes
app.use("/user", userRoute);
app.use("/auth", authRoute);
//catch all unhandled routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "cannot access this end point",
  });
});
//Database connection
mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => console.log("connected to mongoose"))
  .catch((err) => console.error(err));

//middleware manageError used to handle errors in the application and send a response to the client with a status code and error message.
app.use(manageError);
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
