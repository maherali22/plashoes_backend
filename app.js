require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routes/userRoutes");
app.use(express.json());
app.use(userRoute);

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => console.log("connected to mongoose"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
