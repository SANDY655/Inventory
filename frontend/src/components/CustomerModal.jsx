import { FaTimes, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

export default function CustomerModal({ customer, onClose }) {
  if (!customer) return null;

  const excludedKeys = [
    "_id",
    "__v",
    "createdAt",
    "updatedAt",
    "socialMediaFollowing",
  ];

  const formatKey = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase())
      .replace(/_/g, " ");

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const renderValue = (key, value) => {
    if (key.toLowerCase().includes("date")) {
      return <span>{formatDate(value)}</span>;
    }
    return <span>{String(value ?? "N/A")}</span>;
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 "
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-11/12 max-w-md p-5 relative border border-gray-200 dark:border-gray-700 transform transition-all duration-200 scale-100"
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
          Customer Details
        </h2>

        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 max-h-[65vh] overflow-y-auto scrollbar-hide pr-1">
          {/* SNO */}
          {customer.SNO && (
            <div className=" dark:bg-blue-900/30 rounded-md p-2 ">
              <p className="font-semibold text-black dark:text-blue-300">
                S.No: <span>{customer.SNO}</span>
              </p>
            </div>
          )}

          {/* Normal Fields */}
          {Object.entries(customer)
            .filter(([key]) => !excludedKeys.includes(key) && key !== "SNO")
            .map(([key, value]) => (
              <div
                key={key}
                className="border border-gray-100 dark:border-gray-800 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex justify-between"
              >
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {formatKey(key)}:
                </p>
                <div className="text-gray-600 dark:text-gray-400 text-right">
                  {value === null || value === undefined || value === ""
                    ? "N/A"
                    : renderValue(key, value)}
                </div>
              </div>
            ))}

          {/* Social Media Section */}
          {customer.socialMediaFollowing && (
            <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
              <p className="font-medium text-gray-800 dark:text-gray-100 mb-2 text-center">
                Social Media Presence
              </p>
              <div className="flex justify-center gap-6">
                {/* Instagram */}
                <div className="relative group">
                  <FaInstagram
                    size={26}
                    className={`transition-transform duration-300 ${
                      customer.socialMediaFollowing.instagram
                        ? "text-pink-500 hover:scale-110"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition">
                    {customer.socialMediaFollowing.instagram ? "Yes" : "No"}
                  </span>
                </div>

                {/* Facebook */}
                <div className="relative group">
                  <FaFacebook
                    size={26}
                    className={`transition-transform duration-300 ${
                      customer.socialMediaFollowing.facebook
                        ? "text-blue-600 hover:scale-110"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition">
                    {customer.socialMediaFollowing.facebook ? "Yes" : "No"}
                  </span>
                </div>

                {/* YouTube */}
                <div className="relative group">
                  <FaYoutube
                    size={26}
                    className={`transition-transform duration-300 ${
                      customer.socialMediaFollowing.youtube
                        ? "text-red-600 hover:scale-110"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition">
                    {customer.socialMediaFollowing.youtube ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
