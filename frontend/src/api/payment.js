import api from "./axios";

export const getMyPayments = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/payments/my?${params}`);
  return res.data;
};

// Admin: payments with filters + pagination
export const getAllPayments = async (params = {}) => {
  const res = await api.get("/payments/admin", { params });
  return res.data;
};
