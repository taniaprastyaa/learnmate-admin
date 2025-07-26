"use client"

import Image from "next/image"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableActions } from "@/components/dashboard/datatable/datatable-actions"
import type { Module } from "@/types"

type ModuleColumnsProps = {
  actions?: (row: Module) => { label: string; onClick: () => void }[]
}

export function getModuleColumns({ actions }: ModuleColumnsProps): ColumnDef<Module>[] {
  return [
    {
      accessorKey: "title",
      header: "Judul Modul",
      cell: ({ row }) => (
        <div className="font-medium line-clamp-1">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "category_name",
      header: "Kategori",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("category_name") ?? "-"}
        </div>
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
        actions ? <DataTableActions row={row.original} actions={actions(row.original)} /> : null,
    },
  ]
}
