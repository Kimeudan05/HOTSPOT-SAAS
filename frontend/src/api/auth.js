import api from "./axios";

export const login = async (email, password) => {
  const res = await api.post(`/auth/login?email=${email}&password=${password}`);
  if (res.data.access_token) {
    localStorage.setItem("token", res.data.access_token);
  }
  return res.data;
};

export const register = async (user) => {
  return await api.post("/auth/register", user);
};

export const logout = () => {
  localStorage.removeItem("token");
};
