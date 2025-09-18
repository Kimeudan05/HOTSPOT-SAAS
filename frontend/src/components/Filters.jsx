const Filters = ({ filterInputs, setFilterInputs, onApply }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Phone Number"
        value={filterInputs.phone}
        onChange={(e) =>
          setFilterInputs({ ...filterInputs, phone: e.target.value })
        }
        className="border rounded p-2 w-36"
      />
      <select
        value={filterInputs.status}
        onChange={(e) =>
          setFilterInputs({ ...filterInputs, status: e.target.value })
        }
        className="border rounded p-2 w-36"
      >
        <option value="">All</option>
        <option value="Success">Success</option>
        <option value="Failed">Failed</option>
        <option value="Pending">Pending</option>
      </select>
      <label></label>
      <input
        type="number"
        placeholder="Min Amount"
        value={filterInputs.minAmount}
        onChange={(e) =>
          setFilterInputs({ ...filterInputs, minAmount: e.target.value })
        }
        className="border p-2 w-36"
      />
      <input
        type="date"
        value={filterInputs.startDate}
        onChange={(e) =>
          setFilterInputs({ ...filterInputs, startDate: e.target.value })
        }
        className="border rounded p-2 w-36"
      />

      <input
        type="date"
        value={filterInputs.endDate}
        onChange={(e) =>
          setFilterInputs({ ...filterInputs, endDate: e.target.value })
        }
        className="border rounded p-2 w-36"
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={onApply}
      >
        Filter
      </button>
    </div>
  );
};

export default Filters;
