import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSummaryOverTime = async () => {
      let res = await fetch("http://localhost:8000/payments");
      let payments = await res.json();

      //group payments by date
      const grouped = {};
      payments.forEach((p) => {
        const date = new Date(p.created_at).toLocaleDateString();
        if (!grouped[date]) grouped[date] = 0;
        if (p.status === "Success") grouped[date] += p.amount;
      });
      const chartData = Object.keys(grouped).map((date) => ({
        date,
        revenue: grouped[date],
      }));
      setData(chartData);
    };
    fetchSummaryOverTime();
  }, []);
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Revenue over time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
