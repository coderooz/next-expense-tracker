import type { Expense } from "@/types/expenses.types";

export function exportTransactions(rows: Expense[]) {
  const headers = [
    "Title",
    "Category",
    "Date",
    "Type",
    "Amount",
    "Payment",
  ];

  const escapeCSV = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map(row =>
      [
        row.title,
        row.category,
        row.date,
        row.type,
        row.amount,
        row.payment,
      ].map(escapeCSV).join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "pennywise-transactions.csv";
  anchor.click();

  URL.revokeObjectURL(url);
}