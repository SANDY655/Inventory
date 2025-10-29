import { useEffect, useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaTrashAlt,
  FaTrash,
  FaRegTrashAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomerModal from "../components/CustomerModal"; // adjust path if needed

const URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    googleReview: "",
    dataEntry: "",
    mobileGroup: "",
    chitInformed: "",
    chitJoining: "",
    purchase: "",
    goldOrSilver: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit: 6,
        ...filters,
      });

      const res = await fetch(`${URL}/api/customer/get?${params}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setCustomers(data.data);
        setTotalPages(data.totalPages);
      } else {
        toast.error("Failed to fetch customers");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${URL}/api/customer/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) toast.success("Deleted Successfully");
      fetchCustomers();
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    } catch (error) {
      toast.error("Failed to Delete");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [filters, page]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 relative">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Customer Dashboard
      </h1>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <div className="relative">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search by name, reference..."
              value={filters.search}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {[
            "googleReview",
            "dataEntry",
            "mobileGroup",
            "chitInformed",
            "chitJoining",
            "purchase",
            "goldOrSilver",
          ].map((key) => (
            <select
              key={key}
              name={key}
              value={filters[key]}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (c) => c.toUpperCase())}
              </option>
              {key === "goldOrSilver" ? (
                <>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                </>
              ) : key === "chitJoining" ? (
                <>
                  <option value="Yes">Joined</option>
                  <option value="No">Not Joined</option>
                </>
              ) : (
                <>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </>
              )}
            </select>
          ))}

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
        </div>
      </div>

      {/* Customer Cards */}
      {customers.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No customers found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => (
            <div
              key={c._id}
              onClick={() => setSelectedCustomer(c)}
              className="relative group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md p-6 border border-gray-200 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 cursor-pointer"
            >
              {/* Delete button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening the customer modal
                  setCustomerToDelete(c);
                  setShowDeleteModal(true);
                }}
              >
                <FaRegTrashAlt size={18} />
              </button>

              {/* Customer Name */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                {c.customerName || "Unnamed Customer"}
              </h2>

              {/* Info */}
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  Reference:{" "}
                  <span className="font-medium text-gray-800">
                    {c.reference || "N/A"}
                  </span>
                </p>
                <p>
                  WhatsApp:{" "}
                  <span className="font-medium text-gray-800">
                    {c.WhatsAppNo || "N/A"}
                  </span>
                </p>
                <p>
                  Checked By:{" "}
                  <span className="font-medium text-gray-800">
                    {c.checkedBy || "N/A"}
                  </span>
                </p>
                <p className="text-gray-500">
                  Date:{" "}
                  {c.date
                    ? (() => {
                        const d = new Date(c.date);
                        return `${String(d.getDate()).padStart(
                          2,
                          "0"
                        )}/${String(d.getMonth() + 1).padStart(
                          2,
                          "0"
                        )}/${d.getFullYear()}`;
                      })()
                    : "N/A"}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {c.googleReview && (
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                    Review: {c.googleReview}
                  </span>
                )}
                {c.dataEntry && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                    Entry: {c.dataEntry}
                  </span>
                )}
                {c.chitInformed && (
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                    Informed: {c.chitInformed}
                  </span>
                )}
                {c.chitJoining && (
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 font-medium">
                    Joining: {c.chitJoining}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 gap-3">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-2 text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/add-customer")}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition"
        title="Add New Customer"
      >
        <FaPlus className="text-xl" />
      </button>

      {/* Modal Component */}
      <CustomerModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-2xl w-[90%] sm:w-[400px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {customerToDelete?.customerName || "this customer"}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(customerToDelete?._id)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
