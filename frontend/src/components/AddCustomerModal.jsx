import { useState, useEffect } from "react";
import { FaTimes, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";
const URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");
export default function AddCustomerModal({ onClose, fetchCustomers }) {
  const [formData, setFormData] = useState({
    customerName: "",
    WhatsAppNo: "",
    StaffName1: "",
    StaffName2: "",
    googleReview: "No",

    reference: "",
    dataEntry: "No",
    mobileGroup: "No",
    chitJoining: "No",
    chitInformed: "No",
    purchase: "No",
    goldOrSilver: "None",
    checkedBy: "",
    date: "",
    socialMediaFollowing: {
      instagram: false,
      facebook: false,
      youTube: false,
    },
  });

  // Set current date as default and restrict past dates
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, date: today }));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSocialMedia = (platform) => {
    setFormData((prev) => ({
      ...prev,
      socialMediaFollowing: {
        ...prev.socialMediaFollowing,
        [platform]: !prev.socialMediaFollowing[platform],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/api/customer/create`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Customer Added Successfully");
        fetchCustomers();
      }
    } catch (error) {
      toast.error("Failed to Add Customer");
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-11/12 max-w-md p-5 relative border border-gray-200 dark:border-gray-700 transform transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
        >
          <FaTimes size={18} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 text-center">
          Add New Customer
        </h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 text-sm text-gray-700 dark:text-gray-300 max-h-[65vh] overflow-y-auto scrollbar-hide pr-1"
        >
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
              required
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              WhatsApp Number
            </label>
            <input
              type="text"
              name="WhatsAppNo"
              value={formData.WhatsAppNo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
            />
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium mb-1">Reference</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
            />
          </div>

          {/* Staff Names */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Staff Name 1
            </label>
            <input
              type="text"
              name="StaffName1"
              value={formData.StaffName1}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Staff Name 2
            </label>
            <input
              type="text"
              name="StaffName2"
              value={formData.StaffName2}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
            />
          </div>

          {/* Google Review */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Google Review
            </label>
            <select
              name="GoogleReview"
              value={formData.googleReview}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Yes/No dropdowns */}
          {[
            "dataEntry",
            "mobileGroup",
            "chitJoining",
            "chitInformed",
            "purchase",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </label>
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          ))}
          {/* Gold or Silver */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Gold Or Silver
            </label>
            <select
              name="goldOrSilver"
              value={formData.goldOrSilver}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
            >
              <option value="None">None</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
          </div>

          {/* Checked By */}
          <div>
            <label className="block text-sm font-medium mb-1">Checked By</label>
            <input
              type="text"
              name="checkedBy"
              value={formData.checkedBy}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
            />
          </div>

          {/* Social Media Following (Icons) */}
          {formData.socialMediaFollowing && (
            <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
              <p className="font-medium text-gray-800 dark:text-gray-100 mb-2 text-center">
                Social Media Presence
              </p>
              <div className="flex justify-center gap-6">
                {["instagram", "facebook", "youtube"].map((platform) => (
                  <div
                    key={platform}
                    className="flex flex-col items-center gap-1 cursor-pointer"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        socialMediaFollowing: {
                          ...prev.socialMediaFollowing,
                          [platform]: !prev.socialMediaFollowing[platform],
                        },
                      }))
                    }
                  >
                    {platform === "instagram" && (
                      <FaInstagram
                        size={26}
                        className={`transition-transform duration-300 ${
                          formData.socialMediaFollowing.instagram
                            ? "text-pink-500"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                    {platform === "facebook" && (
                      <FaFacebook
                        size={26}
                        className={`transition-transform duration-300 ${
                          formData.socialMediaFollowing.facebook
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                    {platform === "youtube" && (
                      <FaYoutube
                        size={26}
                        className={`transition-transform duration-300 ${
                          formData.socialMediaFollowing.youtube
                            ? "text-red-600"
                            : "text-gray-400"
                        }`}
                      />
                    )}
                    <span className="text-[10px] text-gray-500">
                      {formData.socialMediaFollowing[platform] ? "Yes" : "No"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:opacity-90 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
