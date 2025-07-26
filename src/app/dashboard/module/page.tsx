"use client";

import { useState, useEffect } from "react";
import { useModuleStore } from "@/stores/moduleStore";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getModuleColumns } from "@/components/dashboard/datatable/columns/module";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { TableSearch } from "@/components/dashboard/datatable/table-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteModuleDialog } from "@/components/dashboard/forms/module/delete";

export default function ModulePage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { modules, fetchModules, loading } = useModuleStore();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(0);
  const [selectedModuleTitle, setSelectedModuleTitle] = useState("");

  useEffect(() => {
    const getModules = async () => {
      try {
        await fetchModules();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Terjadi kesalahan saat mengambil data modul");
        }
      }
    };
    getModules();
  }, [fetchModules]);

  const table = useReactTable({
    data: modules,
    columns: getModuleColumns({
      actions: (row) => [
        {
          label: "Lihat Detail",
          onClick: () => {
            router.push(`/dashboard/module/${row.id}`);
          },
        },
        {
          label: "Ubah",
          onClick: () => {
            router.push(`/dashboard/module/${row.id}/update`);
          },
        },
        {
          label: "Hapus",
          onClick: () => {
            setSelectedModuleId(row.id);
            setSelectedModuleTitle(row.title);
            setDeleteDialogOpen(true);
          },
        },
      ],
    }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Daftar Modul</CardTitle>
          <div className="flex gap-5 items-center mt-2">
            <TableSearch value={globalFilter} onChange={setGlobalFilter} />
            <Button asChild>
              <Link href="/dashboard/module/create">
                <IconPlus className="w-5 h-5 mr-2" />
                Tambah Modul
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Memproses...</p>
          ) : (
            <>
              <DataTable table={table} columnsLength={getModuleColumns({}).length} />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>

      <DeleteModuleDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        moduleId={selectedModuleId}
        moduleTitle={selectedModuleTitle}
      />
    </div>
  );
}