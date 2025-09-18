import { useState } from "react";
import { login as apiLogin } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login: AuthLogin } = useAuth();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Invalid email format");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const { access_token } = await apiLogin(email, password); // ✅ get the token from backend
      AuthLogin(access_token); // ✅ save token in context + localStorage
      navigate("/plans");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        alert(err.response.data.detail); // Show specific backend message
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 p-6 rounded-md w-96 shadow"
      >
        <h2 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-500"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
