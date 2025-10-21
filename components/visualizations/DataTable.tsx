"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";

interface DataTableProps {
  title?: string;
  columns: string[];
  rows: Record<string, any>[];
  highlight?: number[];
  sortable?: boolean;
}

export default function DataTable({
  title,
  columns,
  rows,
  highlight = [],
  sortable = true,
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (!sortable) return;

    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedRows = sortColumn
    ? [...rows].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const modifier = sortDirection === "asc" ? 1 : -1;
        return aVal > bVal ? modifier : -modifier;
      })
    : rows;

  return (
    <div className="glass-strong rounded-lg overflow-hidden h-full flex flex-col">
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card border-b border-border">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className={`px-4 py-3 text-left font-medium ${
                    sortable ? "cursor-pointer hover:bg-white/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {column}
                    {sortable && <ArrowUpDown className="w-3 h-3 opacity-50" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-border/50 hover:bg-white/5 ${
                  highlight.includes(index) ? "bg-red-500/10" : ""
                }`}
              >
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3">
                    {row[column]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
