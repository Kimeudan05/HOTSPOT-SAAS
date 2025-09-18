const PaymentTable = ({ payments }) => {
  const maskPhoneNumber = (number) => {
    const str = String(number);
    if (str.length < 10) return str;
    return str.slice(0, 3) + "*****" + str.slice(str.length - 4);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Phone</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Receipt</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{maskPhoneNumber(p.phone_number)}</td>
              <td className="p-2">KES {p.amount}</td>
              <td className="p-2">{p.mpesa_receipt || "-"}</td>
              <td
                className={`p-2 font-bold ${
                  p.status === "Success"
                    ? "text-green-600"
                    : p.status === "Failed"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {p.status}
              </td>
              <td className="p-2">{new Date(p.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
