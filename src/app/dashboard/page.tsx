
import ChartAreaSubModule from "@/components/dashboard/chart-area-sub-module"
import { ChartPieModulePerCategory } from "@/components/dashboard/pie-cart-category"
import { SectionCards } from "@/components/dashboard/section-cards"

export default function DashboardPage() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Area di kiri - lebih luas */}
          <div className="flex-1">
            <ChartAreaSubModule />
          </div>

          {/* Pie Chart di kanan - lebih kecil */}
          <div className="w-full lg:w-[300px]">
            <ChartPieModulePerCategory />
          </div>
        </div>
      </div>

    </>
  )
}
