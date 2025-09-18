import { useEffect, useState } from "react";
import { getPlans, buyPlan } from "../api/plans";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loadingPlanId, setLoadingPlanId] = useState(null); // ✅ Track which plan is loading
  const [phone, setPhone] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function fetchPlans() {
      const data = await getPlans();
      setPlans(data);
    }
    fetchPlans();
  }, []);

  const handleBuy = async (planId, amount) => {
    if (!phone) {
      alert("Enter phone number (e.g., 2547XXXXXXXX)");
      return;
    }
    try {
      setLoadingPlanId(planId); // ✅ Start loading this plan
      await buyPlan(phone, amount);
      setNotification(
        "STK Push sent to your phone. Enter your PIN to complete payment."
      );
    } catch (err) {
      alert("Error initiating payment");
    } finally {
      setLoadingPlanId(null); // ✅ Reset when done
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {notification && (
        <div className="mb-6 flex justify-center">
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative w-full md:w-2/3"
            role="alert"
          >
            <strong className="font-bold">Success: </strong>
            <span className="block sm:inline">{notification}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setNotification(null)}
              style={{ cursor: "pointer" }}
            >
              <svg
                className="fill-current h-6 w-6 text-green-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.172 7.066 4.238a1 1 0 00-1.414 1.414l2.934 2.934-2.934 2.934a1 1 0 101.414 1.414L10 9.828l2.934 2.934a1 1 0 001.414-1.414l-2.934-2.934 2.934-2.934z" />
              </svg>
            </span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Available Plans</h2>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Enter phone (2547XXXXXXX)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-80 rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center"
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Duration: {plan.duration / 60} Hours
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
                KES {plan.price}
              </p>
              <button
                onClick={() => handleBuy(plan.id, plan.price)}
                disabled={loadingPlanId === plan.id}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
              >
                {loadingPlanId === plan.id ? "Processing..." : "Buy Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
