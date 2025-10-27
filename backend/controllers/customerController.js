const Customer = require("../models/Customer");

const createCustomer = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({
      success: true,
      message: "Customer Added Successfully",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
      error: true,
    });
  }
};
const getCustomers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      googleReview,

      dataEntry,
      mobileGroup,
      chitInformed,
      chitJoining,
      purchase,
      goldOrSilver,
      startDate,
      endDate,
    } = req.query;
    const filter = {};
    if (googleReview) filter.googleReview = googleReview;
    if (dataEntry) filter.dataEntry = dataEntry;
    if (mobileGroup) filter.mobileGroup = mobileGroup;
    if (chitInformed) filter.chitInformed = chitInformed;
    if (chitJoining) filter.chitJoining = chitJoining;
    if (goldOrSilver) filter.goldOrSilver = goldOrSilver;
    if (purchase) filter.purchase = purchase;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    } else if (startDate) {
      const start = new Date(startDate);
      const end = new Date(startDate);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }
    if (search.trim() !== "") {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { reference: { $regex: search, $options: "i" } },
        { StaffName1: { $regex: search, $options: "i" } },
        { StaffName2: { $regex: search, $options: "i" } },
        { WhatsAppNo: { $regex: search, $options: "i" } },
        { checkedBy: { $regex: search, $options: "i" } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Customer.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: true,
    });
  }
};
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCustomer) {
      return res.status(404).json({
        message: "Data not found",
        success: false,
        error: true,
      });
    }
    res.status(200).json({
      success: true,
      message: "Customer Updated Successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: true,
    });
  }
};
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: true,
    });
  }
};
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        error: true,
      });

    return res.status(200).json({
      success: true,
      message: "Customer deleted Successfully",
      error: false,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: true,
    });
  }
};
const checkExistingCustomer = async (req, res) => {
  try {
    const { customerName, WhatsAppNo } = req.query;
    const query = {};
    if (customerName)
      query.customerName = { $regex: new RegExp(`^${customerName}$`, "i") };
    if (WhatsAppNo) query.WhatsAppNo = WhatsAppNo;
    const customer = await Customer.findOne(query);
    if (!customer) {
      return res.status(200).json({
        success: true,
        message: "No existing Record",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Customer found",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  checkExistingCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
};
