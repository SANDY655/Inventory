import { useEffect, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CustomerModal from "../components/CustomerModal"; // adjust path if needed

const URL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem("token");

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {" "}
          {customers.map((c) => (
            <div
              onClick={() => setSelectedCustomer(c)}  
              key={c._id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:border-blue-200 transition"
            >
              {" "}
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {" "}
                {c.customerName}{" "}
              </h2>{" "}
              <p className="text-gray-600 text-sm mb-1">
                {" "}
                Reference:{" "}
                <span className="font-medium">{c.reference || "N/A"}</span>{" "}
              </p>{" "}
              <p className="text-gray-600 text-sm mb-1">
                {" "}
                WhatsApp:{" "}
                <span className="font-medium">
                  {c.WhatsAppNo || "N/A"}
                </span>{" "}
              </p>{" "}
              <p className="text-gray-600 text-sm mb-2">
                {" "}
                Checked By:{" "}
                <span className="font-medium">{c.checkedBy || "N/A"}</span>{" "}
              </p>{" "}
              <p className="text-gray-500 text-sm mb-3">
                {" "}
                Date:{" "}
                {c.date
                  ? (() => {
                      const d = new Date(c.date);
                      const day = String(d.getDate()).padStart(2, "0");
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const year = d.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()
                  : "N/A"}{" "}
              </p>{" "}
              <div className="flex flex-wrap gap-2 text-xs mt-2">
                {" "}
                {c.googleReview && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    {" "}
                    Review: {c.googleReview}{" "}
                  </span>
                )}{" "}
                {c.dataEntry && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {" "}
                    Entry: {c.dataEntry}{" "}
                  </span>
                )}{" "}
                {c.chitInformed && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                    {" "}
                    Informed: {c.chitInformed}{" "}
                  </span>
                )}{" "}
                {c.chitJoining && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                    {" "}
                    Joining: {c.chitJoining}{" "}
                  </span>
                )}{" "}
              </div>{" "}
            </div>
          ))}{" "}
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
    </div>
  );
}
