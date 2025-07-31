"use client";

import { ReactNode } from "react";
import ActionDropdown from "./ActionDropdown";

interface Column {
  label: string;
  key: string;
}

type StatusColorMap = Record<string, string>;

interface DataTableCardProps<T extends Record<string, unknown>> {
  title?: string;
  total?: ReactNode;
  columns: Column[];
  rows: T[];
  statusColorMap?: StatusColorMap;
  minHeight?: string;
  enableActions?: boolean;
  onActionClick?: (row: T, action: string) => void;
  striped?: boolean;
}

export default function DataTableCard<T extends Record<string, unknown>>({
  title,
  total,
  columns,
  rows,
  statusColorMap = {},
  minHeight,
  enableActions = false,
  onActionClick,
  striped = true,
}: DataTableCardProps<T>) {
  console.log(rows);

  return (
    <div
      className="rounded-xl border border-[#F8F9FA] bg-white shadow-[0_4px_20px_0_#EEEEEE80] p-4 sm:p-6 w-full"
      style={{ minHeight }}
    >
      {title && (
        <h2 className="text-[#05004E] font-semibold text-xl sm:text-2xl mb-4 sm:mb-6 pb-2">
          {title}
        </h2>
      )}

      {total && <div className="mb-4">{total}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left text-[#1E3A8A] text-xs sm:text-sm border-b border-[#F2F3F9]">
              {columns.map((col) => (
                <th key={col.key} className="pb-2  sm:pb-3 whitespace-nowrap">
                  {col.label.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm text-[#19191D]">
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-[#F8F9FA] last:border-none relative ${
                  striped ? (i % 2 === 1 ? "bg-[#F7F9FC]" : "") : ""
                }`}
              >
                {columns.map((col, index) => {
                  const isLast = index === columns.length - 1;
                  const cellValue = row[col.key];

                  return (
                    <td
                      key={col.key}
                      className={`py-2 px-2 sm:py-3 ${!isLast ? "pr-4" : ""} ${
                        col.key === "status"
                          ? "whitespace-nowrap flex items-center gap-2"
                          : "whitespace-nowrap"
                      }`}
                    >
                      {col.key === "status" &&
                      typeof cellValue === "string" &&
                      statusColorMap[cellValue] ? (
                        <>
                          <span
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                            style={{
                              backgroundColor: statusColorMap[cellValue],
                            }}
                          />
                          <span>{cellValue}</span>
                        </>
                      ) : col.key === "actions" &&
                        enableActions &&
                        "dropdownActions" in row &&
                        Array.isArray(
                          (row as { dropdownActions?: string[] })
                            .dropdownActions
                        ) ? (
                        <ActionDropdown
                          items={
                            (row as { dropdownActions?: string[] })
                              .dropdownActions ?? []
                          }
                          onSelect={(action) => onActionClick?.(row, action)}
                        />
                      ) : (
                        (cellValue as ReactNode)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
