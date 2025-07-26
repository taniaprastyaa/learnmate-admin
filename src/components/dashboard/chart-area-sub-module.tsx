"use client"

import React, { useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useStatisticStore } from "@/stores/statisticStore";

const chartConfig = {
  submodules: {
    label: "Total Submodul",
    color: "var(--color-main)",
  },
} satisfies ChartConfig;

export default function ChartAreaSubModule() {
  const {
    subModulesLast12Months,
    loading,
    fetchSubModulesLast12Months,
  } = useStatisticStore();

  useEffect(() => {
    fetchSubModulesLast12Months();
  }, [fetchSubModulesLast12Months]);

  const chartData = subModulesLast12Months.map((item) => ({
    month: item.submodule_month_name,
    submodules: item.submodule_count,
  }));

  const startDate = subModulesLast12Months.length > 0
    ? `${subModulesLast12Months[0].submodule_month_name.slice(0, 3)} ${subModulesLast12Months[0].submodule_year}`
    : "";
  const endDate = subModulesLast12Months.length > 0
    ? `${subModulesLast12Months[subModulesLast12Months.length - 1].submodule_month_name.slice(0, 3)} ${subModulesLast12Months[subModulesLast12Months.length - 1].submodule_year}`
    : "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Submodul (12 Bulan Terakhir)</CardTitle>
        <CardDescription>
          Menampilkan jumlah submodul yang dibuat setiap bulan selama 12 bulan terakhir.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-muted-foreground">Memuat data submodul...</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="submodules"
                type="natural"
                fill="var(--color-main)"
                fillOpacity={0.4}
                stroke="var(--color-main)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Statistik submodul bulanan. <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {startDate} - {endDate}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
