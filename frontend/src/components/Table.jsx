export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2">
                    {row[col.toLowerCase()] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
