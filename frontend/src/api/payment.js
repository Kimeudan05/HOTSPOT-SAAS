import api from "./axios";

export const getMyPayments = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/payments/my?${params}`);
  return res.data;
};
