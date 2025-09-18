import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import saveAs from "file-saver";

function ExportButtons({ payments, visibleColumns }) {
  const headers = visibleColumns.map((col) => col.label);

  const formatRows = () =>
    payments.map((p) =>
      visibleColumns.map((col) => {
        if (col.key === "created_at")
          return new Date(p[col.key]).toLocaleString();
        return p[col.key] || "-";
      })
    );

  // --- PDF Export ---
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("M-Pesa Payments Report", 14, 15);
    autoTable(doc, {
      head: [headers],
      body: formatRows(),
      startY: 20,
    });
    doc.save("payments_report.pdf");
  };

  // --- CSV Export ---
  const exportCSV = () => {
    const rows = formatRows();
    const csv = Papa.unparse({
      fields: headers,
      data: rows,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "payments_report.csv");
  };

  // --- Excel Export ---
  const exportExcel = () => {
    const rows = formatRows();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "payments_report.xlsx");
  };

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={exportPDF}
        className="bg-green-600 text-white px-3 py-2 rounded shadow hover:bg-green-700"
      >
        📄 PDF
      </button>
      <button
        onClick={exportCSV}
        className="bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700"
      >
        📑 CSV
      </button>
      <button
        onClick={exportExcel}
        className="bg-purple-600 text-white px-3 py-2 rounded shadow hover:bg-purple-700"
      >
        📊 Excel
      </button>
    </div>
  );
}

export default ExportButtons;
