"use client";

import { useEffect } from "react";
import { useStatisticStore } from "@/stores/statisticStore";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  const {
    totalCategories,
    totalModules,
    totalSubModules,
    averageSubModuleDuration,
    fetchSubModuleTotals,
    loading,
  } = useStatisticStore();

  useEffect(() => {
    fetchSubModuleTotals();
  }, [fetchSubModuleTotals]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Kategori</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : totalCategories}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Jumlah kategori modul yang tersedia
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Modul</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : totalModules}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Modul utama yang tersedia di sistem
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Sub Modul</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : totalSubModules}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Jumlah seluruh sub modul yang dibuat
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Rata-rata Durasi Sub Modul</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? "..." : `${averageSubModuleDuration} menit`}
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-sm text-muted-foreground">
          Estimasi waktu belajar per sub modul
        </CardFooter>
      </Card>
    </div>
  );
}
