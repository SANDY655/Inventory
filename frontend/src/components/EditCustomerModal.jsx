import { useState } from "react";
import { FaTimes, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { toast } from "react-toastify";
const URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");
export default function EditCustomerModal({
  customer,
  onClose,
  fetchCustomers,
}) {
  if (!customer) return null;

  const excludedKeys = [
    "_id",
    "__v",
    "createdAt",
    "updatedAt",
    "socialMediaFollowing",
  ];

  // Fields that should have Yes/No dropdowns
  const yesNoFields = [
    "Purchase",
    "Chit Joining",
    "Chit Informed",
    "Mobile Group",
    "Data Entry",
    "Google Review",
  ];

  // Fields that should have Gold/Silver dropdowns
  const goldSilverFields = ["Gold Or Silver"];

  // Local editable state
  const [formData, setFormData] = useState(customer);

  const formatKey = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .replace(/_/g, " ");

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/api/customer/${customer._id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      toast.success("Updated Successfully");
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to Edit");
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-11/12 max-w-md p-5 relative border border-gray-200 dark:border-gray-700 transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
        >
          <FaTimes size={18} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-300 dark:border-gray-700 pb-2 text-center">
          Edit Customer
        </h2>

        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 max-h-[65vh] overflow-y-auto scrollbar-hide pr-1">
          {/* SNO (Read-only) */}
          {formData.SNO && (
            <div className="dark:bg-blue-900/30 rounded-md p-2">
              <p className="font-semibold text-black dark:text-blue-300">
                S.No: <span>{formData.SNO}</span>
              </p>
            </div>
          )}

          {/* Editable Fields */}
          {Object.entries(formData)
            .filter(([key]) => !excludedKeys.includes(key) && key !== "SNO")
            .map(([key, value]) => {
              const label = formatKey(key);

              return (
                <div
                  key={key}
                  className="border border-gray-100 dark:border-gray-800 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <label
                    htmlFor={key}
                    className="block font-medium text-gray-800 dark:text-gray-200 mb-1"
                  >
                    {label}:
                  </label>

                  {/* Yes/No Dropdown */}
                  {yesNoFields.includes(label) ? (
                    <select
                      id={key}
                      value={value || "No"}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-2 py-1 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  ) : goldSilverFields.includes(label) ? (
                    /* Gold/Silver Dropdown */
                    <select
                      id={key}
                      value={value || "Gold"}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-2 py-1 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-yellow-500 outline-none"
                    >
                      <option value="Gold">Gold</option>
                      <option value="Silver">Silver</option>
                      <option value="None">None</option>
                    </select>
                  ) : key.toLowerCase().includes("date") ? (
                    /* Date Field */
                    <input
                      id={key}
                      type="date"
                      value={
                        value ? new Date(value).toISOString().split("T")[0] : ""
                      }
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-2 py-1 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    /* Default Text Field */
                    <input
                      id={key}
                      type="text"
                      value={value ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 px-2 py-1 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  )}
                </div>
              );
            })}

          {/* Social Media Section */}
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
        </div>

        {/* Save Button */}
        <div className="mt-4 text-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
