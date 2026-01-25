"use client";

type Column<T> = {
  header: string;
  accessor: (row: T) => string | number | null | undefined;
};

interface ExportCSVProps<T> {
  data: T[];
  columns: Column<T>[];
  filename?: string;
  label?: string;
}

export default function ExportCSV<T>({
  data,
  columns,
  filename = "export.csv",
  label = "Exportar Excel (CSV)",
}: ExportCSVProps<T>) {
  const descargarCSV = () => {
    if (!data?.length) return;

    const headers = columns.map((c) => c.header);

    const filas = data.map((row) =>
      columns.map((c) => c.accessor(row) ?? "")
    );

    const csvContent =
      "\uFEFF" +
      [headers, ...filas]
        .map((fila) =>
          fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")
        )
        .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={descargarCSV}
      className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded transition"
    >
      {label}
    </button>
  );
}
