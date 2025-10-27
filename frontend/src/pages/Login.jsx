import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // parse JSON in any case

      if (res.ok) {
        toast.success("Login Successful");
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        // show backend error message
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      // network or unexpected errors
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side (Image / Illustration / Branding) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-400 to-purple-600 items-center justify-center text-white">
        <div className="text-center px-6">
          <h2 className="text-4xl font-bold mb-3">Welcome Back!</h2>
          <p className="text-lg opacity-90">
            Sign in to continue to your dashboard.
          </p>
        </div>
      </div>

      {/* Right Side (Login Form) */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center min-h-screen ">
        <div className="bg-white rounded-md shadow-xl p-6 sm:p-8 w-full max-w-sm">
          <h3 className="text-center font-semibold text-2xl mb-5 text-gray-800">
            Login to Your Account
          </h3>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 top-[28px] flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
