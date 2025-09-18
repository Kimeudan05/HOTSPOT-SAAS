import api from "./axios";

export const getPlans = async () => {
  const res = await api.get("/plans/");
  return res.data;
};

export const buyPlan = async (phone_number, amount) => {
  const res = await api.post(
    `/payments/stk_push?phone_number=${phone_number}&amount=${amount}`
  );
  return res.data;
};
