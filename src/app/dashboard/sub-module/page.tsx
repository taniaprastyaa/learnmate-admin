"use client";

import { useState, useEffect } from "react";
import { useSubModuleStore } from "@/stores/subModuleStore";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { getSubModuleColumns } from "@/components/dashboard/datatable/columns/sub-module";
import { DataTable } from "@/components/dashboard/datatable/datatable";
import { DataTablePagination } from "@/components/dashboard/datatable/datatable-pagination";
import { TableSearch } from "@/components/dashboard/datatable/table-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DeleteSubModuleDialog } from "@/components/dashboard/forms/sub-module/delete";

export default function SubModulePage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const { subModules, fetchSubModules, loading } = useSubModuleStore();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSubModuleId, setSelectedSubModuleId] = useState(0);
  const [selectedSubModuleTitle, setSelectedSubModuleTitle] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        await fetchSubModules();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Gagal memuat data submodul");
      }
    };
    load();
  }, [fetchSubModules]);

  const table = useReactTable({
    data: subModules,
    columns: getSubModuleColumns({
      actions: (row) => [
        {
          label: "Lihat Detail",
          onClick: () => router.push(`/dashboard/sub-module/${row.id}`),
        },
        {
          label: "Ubah",
          onClick: () => router.push(`/dashboard/sub-module/${row.id}/update`),
        },
        {
          label: "Hapus",
          onClick: () => {
            setSelectedSubModuleId(row.id);
            setSelectedSubModuleTitle(row.title);
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
          <CardTitle>Daftar Submodul</CardTitle>
          <div className="flex gap-5 items-center mt-2">
            <TableSearch value={globalFilter} onChange={setGlobalFilter} />
            <Button asChild>
              <Link href="/dashboard/sub-module/create">
                <IconPlus className="w-5 h-5 mr-2" />
                Tambah Submodul
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Memproses...</p>
          ) : (
            <>
              <DataTable table={table} columnsLength={getSubModuleColumns({}).length} />
              <DataTablePagination table={table} />
            </>
          )}
        </CardContent>
      </Card>

      <DeleteSubModuleDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        subModuleId={selectedSubModuleId}
        subModuleTitle={selectedSubModuleTitle}
      />
    </div>
  );
}
