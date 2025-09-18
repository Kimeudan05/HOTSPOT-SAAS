import { useEffect, useState } from "react";
import { getAllSessions, revokeSession } from "../../api/sessions";
import Table from "../../components/Table";

export default function AdminSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const data = await getAllSessions();
      setSessions(data);
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6">All Sessions (Admin)</h2>

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
                    <td className="px-4 py-2">{s.phone_number}</td>
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
      </div>
    </div>
  );
}
