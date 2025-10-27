const express = require("express");
const {
  createCustomer,
  getCustomers,
  updateCustomer,
  getCustomerById,
  deleteCustomer,
  checkExistingCustomer,
} = require("../controllers/customerController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/create", auth, createCustomer);
router.get("/get", auth, getCustomers);
router.get("/get/:id", auth, getCustomerById);
router.patch("/:id", auth, updateCustomer);
router.delete("/:id", auth, deleteCustomer);
router.get("/check", auth, checkExistingCustomer);

module.exports = router;
