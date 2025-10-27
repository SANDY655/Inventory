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

module.exports = { createCustomer, getCustomers };
