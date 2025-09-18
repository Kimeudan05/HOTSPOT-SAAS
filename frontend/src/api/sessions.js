import api from "./axios";

// User sessions
export const getMySessions = async () => {
  const res = await api.get("/sessions/my");
  return res.data;
};

// Admin sessions
export const getAllSessions = async () => {
  const res = await api.get("/sessions/admin");
  return res.data;
};

// Admin: revoke a session
export const revokeSession = async (sessionId) => {
  const res = await api.post(`/sessions/admin/revoke/${sessionId}`);
  return res.data;
};
