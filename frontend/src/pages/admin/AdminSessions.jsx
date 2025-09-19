import { useEffect, useState } from "react";
import { getAllSessions, revokeSession } from "../../api/sessions";
import { getPlans } from "../../api/plans"; // You need this API call to fetch plans dynamically

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [phoneFilter, setPhoneFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // optional, if backend provides it
  const pageSize = 10;

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [phoneFilter, statusFilter, planFilter, page]);

  const fetchPlans = async () => {
    try {
      const data = await getPlans();
      setPlans(data);
    } catch (err) {
      console.error("Failed to fetch plans", err);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await getAllSessions({
        phone_number: phoneFilter || undefined,
        status: statusFilter || undefined,
        plan_name: planFilter || undefined,
        page,
        page_size: pageSize,
      });

      // If backend returns total, extract it
      // If not, just use the sessions list
      if (Array.isArray(data)) {
        setSessions(data);
      } else {
        setSessions(data.sessions || []);
        if (data.total) {
          setTotalPages(Math.ceil(data.total / pageSize));
        }
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this session?"))
      return;
    try {
      await revokeSession(id);
      alert(`Session ${id} revoked successfully`);
      fetchSessions();
    } catch (err) {
      console.error("Failed to revoke session", err);
      alert("Failed to revoke session");
    }
  };

  // Mask phone number: 254******123
  const maskPhone = (phone) => {
    if (!phone || phone.length < 6) return phone;
    return phone.slice(0, 3) + "******" + phone.slice(-3);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6">All Sessions (Admin)</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by phone"
            value={phoneFilter}
            onChange={(e) => {
              setPhoneFilter(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          >
            <option value="">All Plans</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.name}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center">Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-center text-gray-500">No sessions found</p>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">User ID</th>
                  <th className="px-4 py-2">Username</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Plan</th>
                  <th className="px-4 py-2">Start</th>
                  <th className="px-4 py-2">End</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr
                    key={s.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-2">{s.id}</td>
                    <td className="px-4 py-2">{s.user?.id ?? "N/A"}</td>
                    <td className="px-4 py-2">{s.user?.username ?? "N/A"}</td>
                    <td className="px-4 py-2">{maskPhone(s.phone_number)}</td>
                    <td className="px-4 py-2">{s.plan_name}</td>
                    <td className="px-4 py-2">
                      {new Date(s.start_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(s.end_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {s.is_active ? "Active ✅" : "Expired ❌"}
                    </td>
                    <td className="px-4 py-2">
                      {s.is_active ? (
                        <button
                          onClick={() => handleRevoke(s.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        >
                          Revoke
                        </button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {sessions.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
