import { create } from "zustand";
import type { Module, NewModule, UpdateModule } from "@/types";
import { supabaseClient } from "@/utils/supabase";
import { generateSlug } from "@/utils/slug";

const supabase = supabaseClient;

interface ModuleState {
  modules: Module[];
  selectedModule: Module | null;
  loading: boolean;
  loadingCrud: boolean;
  fetchModules: () => Promise<void>;
  createModule: (newModule: Omit<NewModule, "slug">) => Promise<void>;
  getModuleById: (id: number) => Promise<void>;
  updateModule: (
    updatedModule: Partial<Omit<UpdateModule, "slug" | "created_at">> & { id: number }
  ) => Promise<void>;
  deleteModule: (id: number) => Promise<void>;
}

export const useModuleStore = create<ModuleState>((set) => ({
  modules: [],
  selectedModule: null,
  loading: false,
  loadingCrud: false,

  fetchModules: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("view_modules_with_category")
      .select("*")
      .order("created_at", { ascending: false });

    set({ loading: false });

    if (error) throw new Error("Gagal mengambil data modul!");

    set({ modules: data });
  },

  createModule: async (newModuleInput) => {
    set({ loadingCrud: true });

    const slug = generateSlug(newModuleInput.title);
    const newModule = { ...newModuleInput, slug };

    const { data, error } = await supabase
      .from("modules")
      .insert(newModule)
      .select()
      .single();

    set({ loadingCrud: false });

    if (error) throw new Error(error.message);

    set((state) => ({ modules: [data, ...state.modules] }));
  },

  getModuleById: async (id) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("view_modules_with_category")
      .select("*")
      .eq("id", id)
      .single();

    set({ loading: false });

    if (error) {
      set({ selectedModule: null });
      console.error("Error fetching module:", error);
      return;
    }

    set({ selectedModule: data });
  },

  updateModule: async (updateInput) => {
    set({ loadingCrud: true });

    const { id, title, ...rest } = updateInput;
    const slug = title ? generateSlug(title) : undefined;
    const updatePayload = { ...rest, ...(title && { title, slug }) };

    const { data, error } = await supabase
      .from("modules")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    set({ loadingCrud: false });

    if (error) throw new Error(error.message);

    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? data : m)),
      selectedModule: data,
    }));
  },

  deleteModule: async (id) => {
    set({ loadingCrud: true });

    const { error } = await supabase
      .from("modules")
      .delete()
      .eq("id", id);

    set({ loadingCrud: false });

    if (error) throw new Error(error.message);

    set((state) => ({
      modules: state.modules.filter((m) => m.id !== id),
      selectedModule: state.selectedModule?.id === id ? null : state.selectedModule,
    }));
  },
}));
