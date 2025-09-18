import { useEffect, useState } from "react";
import SummaryCards from "./components/SummaryCards";
import Filters from "./components/Filters";
import RevenueChart from "./components/RevenueChart";
import PaymentTable from "./components/PaymentTable";
import ExportButtons from "./components/ExportButtons";
// import ExportPDF from "./ExportPDF";

const App = () => {
  // pagination and sorting
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("created_at");

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    phone: "",
    status: "",
    minAmount: "",
    startDate: "",
    endDate: "",
  });
  const [filterInputs, setFilterInputs] = useState({ ...filters });
  const [payments, setPayments] = useState([]);
  // manage vsiible columns to print
  const [visibleColumns, setVisibleColumns] = useState([
    { key: "phone_number", label: "Phone" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "status" },
    { key: "created_at", label: "Date" },
  ]);

  const fetchPayments = async () => {
    let query = [];
    if (filters.phone) query.push(`phone_number=${filters.phone}`);
    if (filters.status) query.push(`status=${filters.status}`);
    if (filters.minAmount) query.push(`min_amount=${filters.minAmount}`);
    if (filters.startDate) query.push(`start_date=${filters.startDate}`);
    if (filters.endDate) query.push(`end_date=${filters.endDate}`);
    // query.push(`page=${page}`);
    // query.push(`page_size=${pageSize}`);
    // query.push(`sort_by=${sortBy}`);
    // query.push(`sort_order=${sortOrder}`);

    let url = `http://localhost:8000/payments${
      query.length ? "?" + query.join("&") : ""
    }`;
    let res = await fetch(url);
    let data = await res.json();
    setPayments(data);
  };

  const fetchSummary = async () => {
    try {
      // setLoading(true);
      // // Simulate a 3-second delay
      // await new Promise((resolve) => setTimeout(resolve, 3000));

      const res = await fetch("http://127.0.0.1:8000/payments/summary");
      if (!res.ok) {
        throw new Error(`HTTP error ! status : ${res.status}`);
      }
      const data = await res.json();
      console.log(" fetched data :", data);
      setSummary(data);
    } catch (err) {
      console.error("Error fetching summary :", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (colKey) => {
    setVisibleColumns((prev) =>
      prev.find((c) => c.key === colKey)
        ? prev.filter((c) => c.key !== colKey)
        : [...prev, allColumns.find((c) => c.key === colKey)]
    );
  };

  const allColumns = [
    { key: "phone_number", label: "Phone" },
    { key: "amount", label: "Amount" },
    { key: "mpesa_receipt", label: "Receipt" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Date" },
  ];

  useEffect(() => {
    fetchPayments();
    fetchSummary();
  }, [filters]);

  return (
    <div className="p-6 bg-gray-600 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 ">Mpesa Payments Dashboard</h1>
      {loading && <p className="text-white">loading..</p>}
      {!loading && summary && <SummaryCards summary={summary} />}
      <RevenueChart />
      <Filters
        filterInputs={filterInputs}
        setFilterInputs={setFilterInputs}
        onApply={() => setFilters(filterInputs)}
      />
      <PaymentTable payments={payments} />
      <div className="mb-4 flex gap-2">
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          {allColumns.map((col) => (
            <label key={col.key} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={visibleColumns.some((c) => c.key === col.key)}
                onChange={() => toggleColumn(col.key)}
              />
              {col.label}
            </label>
          ))}
          <ExportButtons payments={payments} visibleColumns={visibleColumns} />
        </div>
      </div>
    </div>
  );
};

export default App;
