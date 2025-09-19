import { useEffect, useState } from "react";
import { getAllPayments } from "../../api/payment";
import Navbar from "../../components/Navbar";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [minAmount, setMinAmount] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, phoneFilter, minAmount, page]);

  const fetchPayments = async () => {
    try {
      const { data, total } = await getAllPayments({
        status: statusFilter || undefined,
        phone_number: phoneFilter || undefined,
        min_amount: minAmount || undefined,
        page,
        page_size: pageSize,
      });
      setPayments(data);
      setTotal(total);
    } catch (err) {
      console.error("Failed to fetch payments", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6">Payments (Admin)</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by phone"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className="border p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
          <input
            type="number"
            placeholder="Min amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="border p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
        </div>

        {loading ? (
          <p className="text-center">Loading payments...</p>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Receipt</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-2">{p.id}</td>
                    <td className="px-4 py-2">{p.phone_number}</td>
                    <td className="px-4 py-2">KES {p.amount}</td>
                    <td className="px-4 py-2">
                      {p.status === "Success" ? "✅ Success" : "❌ Failed"}
                    </td>
                    <td className="px-4 py-2">{p.mpesa_receipt || "-"}</td>
                    <td className="px-4 py-2">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
