import { useEffect, useState } from "react";
import { getMySessions } from "../api/sessions";
import Table from "../components/Table";
import api from "../api/axios";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const url = user?.is_admin ? "/sessions/admin" : "/sessions/my";
      const data = await api.get(url);
      setSessions(data.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6">My Sessions</h2>

        {loading ? (
          <p className="text-center">Loading sessions...</p>
        ) : (
          <Table
            columns={["ID", "Plan_Name", "Start_Time", "End_Time", "Status"]}
            data={sessions.map((s) => ({
              id: s.id,
              plan_name: s.plan_name,
              start_time: new Date(s.start_time).toLocaleString(),
              end_time: new Date(s.end_time).toLocaleString(),
              status: s.is_active ? "Active ✅" : "Expired ❌",
            }))}
          />
        )}
      </div>
    </div>
  );
}
