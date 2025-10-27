const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/user", userRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Db Connected"))
  .catch((err) => console.error(err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running successfully on port ${PORT}`);
});
