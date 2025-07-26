import { create } from "zustand";
import { supabaseClient } from "@/utils/supabase";

const supabase = supabaseClient;

interface MonthlySubModuleStat {
  submodule_year: number;
  submodule_month_number: number;
  submodule_month_name: string;
  submodule_count: number;
}

interface ModulePerCategoryStat {
  category_id: number;
  category_name: string;
  module_count: number;
}

interface StatisticState {
  totalCategories: number;
  totalModules: number;
  totalSubModules: number;
  averageSubModuleDuration: number;
  subModulesLast12Months: MonthlySubModuleStat[];
  modulesPerCategory: ModulePerCategoryStat[];
  loading: boolean;

  fetchSubModuleTotals: () => Promise<void>;
  fetchSubModulesLast12Months: () => Promise<void>;
  fetchModulesPerCategory: () => Promise<void>;
}

export const useStatisticStore = create<StatisticState>((set) => ({
  totalCategories: 0,
  totalModules: 0,
  totalSubModules: 0,
  averageSubModuleDuration: 0,
  subModulesLast12Months: [],
  modulesPerCategory: [],
  loading: false,

  fetchSubModuleTotals: async () => {
    set({ loading: true });

    const [
      { data: totalCategories, error: err1 },
      { data: totalModules, error: err2 },
      { data: totalSubModules, error: err3 },
      { data: averageDuration, error: err4 },
    ] = await Promise.all([
      supabase.rpc("get_total_categories"),
      supabase.rpc("get_total_modules"),
      supabase.rpc("get_total_sub_modules"),
      supabase.rpc("get_average_sub_module_duration"),
    ]);

    set({ loading: false });

    if (err1 || err2 || err3 || err4) {
      console.error("SubModule Statistik Error:", { err1, err2, err3, err4 });
      throw new Error("Gagal mengambil data statistik SubModule!");
    }

    set({
      totalCategories: totalCategories ?? 0,
      totalModules: totalModules ?? 0,
      totalSubModules: totalSubModules ?? 0,
      averageSubModuleDuration: averageDuration ?? 0,
    });
  },

  fetchSubModulesLast12Months: async () => {
    set({ loading: true });

    const { data, error } = await supabase.rpc("get_submodules_added_last_12_months");

    set({ loading: false });

    if (error) {
      console.error("Error submodule 12 bulan:", error);
      throw new Error("Gagal mengambil statistik SubModule 12 bulan terakhir!");
    }

    set({ subModulesLast12Months: data || [] });
  },

  fetchModulesPerCategory: async () => {
    set({ loading: true });

    const { data, error } = await supabase.rpc("get_total_modules_per_category");

    set({ loading: false });

    if (error) {
      console.error("Error modul per kategori:", error);
      throw new Error("Gagal mengambil data modul per kategori!");
    }

    set({ modulesPerCategory: data || [] });
  },
}));
