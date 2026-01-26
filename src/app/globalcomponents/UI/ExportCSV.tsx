"use client";

type Column<T> = {
  header: string;
  accessor: (row: T) => string | number | null | undefined;
};

interface ExportCSVProps<T> {
  data: T[] | Group<T>[];
  columns: Column<T>[];
  filename?: string;
  label?: string;

  /** Opcional: nombre de la columna del grupo */
  groupHeader?: string;
}

type Group<T> = {
  group: string;
  items: T[];
};

export default function ExportCSV<T>({
  data,
  columns,
  filename = "export.csv",
  label = "Exportar Excel (CSV)",
  groupHeader = "Grupo",
}: ExportCSVProps<T>) {
  const descargarCSV = () => {
    if (!data || !data.length) return;

    const isGrouped = typeof (data as any)[0]?.items !== "undefined";

    const headers = [
      ...(isGrouped ? [groupHeader] : []),
      ...columns.map((c) => c.header),
    ];

    const filas: (string | number)[][] = [];

    if (isGrouped) {
      (data as Group<T>[]).forEach((group) => {
        group.items.forEach((row) => {
          filas.push([
            group.group,
            ...columns.map((c) => c.accessor(row) ?? ""),
          ]);
        });
      });
    } else {
      (data as T[]).forEach((row) => {
        filas.push(columns.map((c) => c.accessor(row) ?? ""));
      });
    }

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
