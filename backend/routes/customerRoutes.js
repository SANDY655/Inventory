const express = require("express");
const {
  createCustomer,
  getCustomers,
} = require("../controllers/customerController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/create", auth, createCustomer);
router.get("/get", auth, getCustomers);

module.exports = router;
