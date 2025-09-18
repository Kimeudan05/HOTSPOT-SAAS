import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const { isLoggedIn, logout, user } = useAuth(); // Access user and isLoggedIn
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Links for normal users
  const userLinks = [
    { label: "Plans", path: "/plans" },
    { label: "My Payments", path: "/payments" },
    { label: "My Sessions", path: "/sessions" },
  ];

  // Links for admins
  const adminLinks = [
    { label: "Dashboard", path: "/admin" },
    { label: "Manage Plans", path: "/admin/plans" },
    { label: "Payments", path: "/payments" },
    { label: "Sessions", path: "/admin/sessions" },
    { label: "Activity Logs", path: "/admin/logs" },
  ];

  // Determine which links to show based on user role
  const linksToShow = user?.is_admin ? adminLinks : userLinks;

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800 shadow">
      {/* Left side: logo + links */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="text-xl font-bold text-gray-800 dark:text-gray-200"
        >
          Hotspot Billing
        </Link>

        {/* Show user/admin links if logged in */}
        {isLoggedIn &&
          linksToShow.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-700 dark:text-gray-300 hover:underline"
            >
              {link.label}
            </Link>
          ))}
      </div>

      {/* Right side: theme toggle + auth buttons */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded bg-gray-300 dark:bg-gray-600 text-sm text-gray-800 dark:text-gray-200"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* Auth buttons */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-3 py-2 bg-red-500 text-white rounded text-sm"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
