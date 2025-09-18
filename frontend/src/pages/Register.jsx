import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// password validation

const getPasswordChecks = (password) => {
  return {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
};
const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const passwordChecks = getPasswordChecks(form.password);
  const passwordsMatch =
    form.password && form.password === form.confirmPassword;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      alert("Username is required");
      return;
    }
    if (!validateEmail(form.email)) {
      alert("Invalid email format");
      return;
    }
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await register({
        username: form.username,
        email: form.email,
        phone_number: form.phone_number,
        password: form.password,
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        alert(err.response.data.detail); // <-- will show "Username already taken", etc.
      } else {
        alert("Registration failed");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-md w-96 shadow"
      >
        <h2 className="text-2xl mb-4 text-gray-800 dark:text-gray-100">
          Register
        </h2>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-3 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Phone */}
        <input
          type="text"
          placeholder="Phone Number (2547XXXXXXX)"
          className="border p-2 w-full mb-3 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          value={form.phone_number}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
        />

        {/* Password */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {/* Password Validation Checklist */}
          <ul className="text-sm mt-2 ml-1 space-y-1 text-red-500 dark:text-red-400">
            {!passwordChecks.length && (
              <li>Password must be at least 6 characters</li>
            )}
            {!passwordChecks.upper && (
              <li>Password must contain an uppercase letter</li>
            )}
            {!passwordChecks.lower && (
              <li>Password must contain a lowercase letter</li>
            )}
            {!passwordChecks.special && (
              <li>Password must include a special character (@, !, #, etc)</li>
            )}
          </ul>
          {form.confirmPassword && (
            <p
              className={`text-sm mt-1 ml-1 ${
                passwordsMatch ? "text-green-500" : "text-red-500"
              }`}
            >
              {passwordsMatch
                ? "✅ Passwords match"
                : "❌ Passwords do not match"}
            </p>
          )}

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

        {/* Confirm Password */}
        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            className="border p-2 w-full rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2 text-gray-500"
          >
            {showConfirm ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded disabled:bg-gray-400"
          disabled={
            !passwordChecks.length ||
            !passwordChecks.upper ||
            !passwordChecks.lower ||
            !passwordChecks.special ||
            !passwordsMatch
          }
        >
          Register
        </button>
      </form>
    </div>
  );
};
export default Register;
