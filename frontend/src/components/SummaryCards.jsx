const SummaryCards = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-gray-600">Revenue</h3>
        <p className="text-2xl font-bold text-green-600">
          KES {summary.total_revenue}
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-gray-600">Transactions</h3>
        <p className="text-2xl font-bold">{summary.total_transactions}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-gray-600">Successiful</h3>
        <p className="text-2xl font-bold text-green-600">
          {summary.success_count}
        </p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-gray-600">Failed</h3>
        <p className="text-2xl font-bold text-red-600">
          {summary.failed_count}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;
