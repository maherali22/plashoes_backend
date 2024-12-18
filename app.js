const express = require("express");
const dotenv = require("dotenv");
const manageError = require("./middleware/manageError");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoutes");
const authRoute = require("./routes/authRoutes");
const adminRoute = require("./routes/adminRoutes");
const connectCloudinary = require("./config/cloudinary");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
dotenv.config();
//Connect to cloudinary
connectCloudinary();
//cors
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("backend is running");
});
//Routes
app.use("/user", userRoute);
app.use("/admin", adminRoute);
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
