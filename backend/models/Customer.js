const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema(
  {
    SNO: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
    },
    StaffName1: {
      type: String,
    },
    StaffName2: {
      type: String,
    },
    WhatsAppNo: {
      type: String,
    },
    googleReview: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    dataEntry: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    mobileGroup: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    chitInformed: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    chitJoining: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    socialMediaFollowing: {
      instagram: { type: Boolean, default: false },
      facebook: { type: Boolean, default: false },
      youtube: { type: Boolean, default: false },
    },
    purchase: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    goldOrSilver: {
      type: String,
      enum: ["Gold", "Silver", "None"],
      default: "None",
    },
    checkedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.pre("save", async function (next) {
  if (this.isNew) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const count = await mongoose.model("Customer").countDocuments({
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    this.SNO = count + 1;
  }
  next();
});
module.exports = mongoose.model("Customer", customerSchema);
