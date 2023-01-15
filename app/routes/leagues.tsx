import { useState } from "react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { auth } from "~/utils/auth.server";

import type { SortingState } from "@tanstack/react-table";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { API_BASE } from "~/constants/index.server";

type League = {
  id: string;
  name: string;
};

export const loader = async ({ request }: LoaderArgs) => {
  const { accessToken } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  const res = await fetch(`${API_BASE}/leagues`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const leagues: League[] = await res.json();

  return json({ leagues });
};

const columnHelper = createColumnHelper<League>();

const columns = [
  columnHelper.accessor("id", {
    header: () => <span>League Id</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.name, {
    id: "name",
    header: () => <span>League Name</span>,
    footer: (info) => info.column.id,
  }),
];

export default function Leagues() {
  const { leagues } = useLoaderData<typeof loader>();
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: leagues,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <h1>Leagues</h1>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
