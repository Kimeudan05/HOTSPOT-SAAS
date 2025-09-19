import api from "./axios";

// User sessions
export const getMySessions = async () => {
  const res = await api.get("/sessions/my");
  return res.data;
};

// Admin: all sessions with filters + pagination
export const getAllSessions = async (params = {}) => {
  const res = await api.get("/sessions/admin", { params });
  return res.data;
};

// Admin: revoke a session
export const revokeSession = async (sessionId) => {
  const res = await api.post(`/sessions/admin/revoke/${sessionId}`);
  return res.data;
};
