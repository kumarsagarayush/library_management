import type { ReactNode } from "react";

export interface DataColumn<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataColumn<T>[];
  rowKey: (item: T) => string | number;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  emptyMessage = "No records found."
}: DataTableProps<T>) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}>{column.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-cell">{emptyMessage}</td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={rowKey(item)}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render(item)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}