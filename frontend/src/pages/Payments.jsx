import { useEffect, useState } from "react";
import Table from "../components/Table";

import { getMyPayments } from "../api/payment";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("");
  const [minAmount, setMinAmount] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const filters = {};
    if (status) filters.status = status;
    if (minAmount) filters.min_amount = minAmount;
    const data = await getMyPayments(filters);
    setPayments(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6">My Payments</h2>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
          <input
            type="number"
            placeholder="Min Amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="border p-2 rounded bg-white dark:bg-gray-800 dark:border-gray-600"
          />
          <button
            onClick={fetchPayments}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Filter
          </button>
        </div>

        {/* Payments Table */}
        <Table
          columns={[
            "ID",
            "Plan",
            "Phone_Number",
            "Amount",
            "Status",
            "Created_At",
          ]}
          data={payments.map((p) => ({
            id: p.id,
            plan: p.plan?.name || "-", // ✅ show plan
            phone_number: p.phone_number,
            amount: p.amount,
            status: p.status,
            created_at: new Date(p.created_at).toLocaleString(),
          }))}
        />
      </div>
    </div>
  );
}
