import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Hotspot Billing</h1>
      <p className="mb-8 text-lg">Pay with M-Pesa and enjoy internet access.</p>
      <div className="flex gap-4">
        <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded">
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
