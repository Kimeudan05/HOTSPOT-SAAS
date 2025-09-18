import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExportPDF({ payments, visibleColumns }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    const columns = visibleColumns.map((col) => col.label);
    const rows = payments.map((p) =>
      visibleColumns.map((col) => {
        if (col.key === "created_at")
          return new Date(p[col.key]).toLocaleString();
        return p[col.key] || "-";
      })
    );

    doc.text("M-Pesa Payments Report", 14, 15);
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });
    doc.save("payments_report.pdf");
  };

  return (
    <button
      onClick={exportPDF}
      className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
    >
      📄 Export to PDF
    </button>
  );
}

export default ExportPDF;
