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

type Player = {
  id: string;
  name: string;
  footballTeam: {
    name: string;
  };
};

export const loader = async ({ request }: LoaderArgs) => {
  const { accessToken } = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });

  console.log("API Base", process.env.API_BASE);

  const res = await fetch(`${process.env.API_BASE}/players`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const players: Player[] = await res.json();

  return json({ players });
};

const columnHelper = createColumnHelper<Player>();

const columns = [
  columnHelper.accessor("name", {
    header: () => <span>Player Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.footballTeam.name, {
    id: "teamName",
    header: () => <span>Team Name</span>,
    footer: (info) => info.column.id,
  }),
];

export default function Players() {
  const { players } = useLoaderData<typeof loader>();
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: players,
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
      <h1>Players</h1>
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
