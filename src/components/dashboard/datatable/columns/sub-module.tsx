"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableActions } from "@/components/dashboard/datatable/datatable-actions"
import type { SubModule } from "@/types"

type SubModuleColumnsProps = {
  actions?: (row: SubModule) => { label: string; onClick: () => void }[]
}

export function getSubModuleColumns({
  actions,
}: SubModuleColumnsProps): ColumnDef<SubModule>[] {
  return [
    {
      accessorKey: "title",
      header: "Judul Submodul",
      cell: ({ row }) => (
        <div className="font-medium line-clamp-1">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "module_title",
      header: "Modul Induk",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("module_title") ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "duration_minutes",
      header: "Durasi (menit)",
      cell: ({ row }) => (
        <div className="text-sm text-gray-700">
          {row.getValue("duration_minutes") ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "order",
      header: "Urutan",
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {row.getValue("order")}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Tanggal",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <span>{date.toLocaleDateString("id-ID")}</span>
      },
    },
    {
      id: "actions",
      cell: ({ row }) =>
        actions ? (
          <DataTableActions
            row={row.original}
            actions={actions(row.original)}
          />
        ) : null,
    },
  ]
}
