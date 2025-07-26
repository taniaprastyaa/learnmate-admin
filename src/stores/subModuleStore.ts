import { create } from "zustand";
import type { SubModule, NewSubModule, UpdateSubModule } from "@/types";
import { supabaseClient } from "@/utils/supabase";
import { generateSlug } from "@/utils/slug";

const supabase = supabaseClient;

interface SubModuleState {
  subModules: SubModule[];
  selectedSubModule: SubModule | null;
  loading: boolean;
  loadingCrud: boolean;
  fetchSubModules: () => Promise<void>;
  createSubModule: (newSubModule: Omit<NewSubModule, "slug">) => Promise<void>;
  getSubModuleById: (id: number) => Promise<void>;
  updateSubModule: (
    updatedSubModule: Partial<Omit<UpdateSubModule, "slug" | "created_at">> & { id: number }
  ) => Promise<void>;
  deleteSubModule: (id: number) => Promise<void>;
}

export const useSubModuleStore = create<SubModuleState>((set) => ({
  subModules: [],
  selectedSubModule: null,
  loading: false,
  loadingCrud: false,

  fetchSubModules: async () => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("view_sub_modules_with_module")
      .select("*")
      .order("created_at", { ascending: false });

    set({ loading: false });

    if (error) throw new Error("Gagal mengambil data submodul!");

    set({ subModules: data });
  },

  createSubModule: async (newSubModuleInput) => {
    set({ loadingCrud: true });

    const slug = generateSlug(newSubModuleInput.title);
    const newSubModule = { ...newSubModuleInput, slug };

    const { data, error } = await supabase
      .from("sub_modules")
      .insert(newSubModule)
      .select()
      .single();

    set({ loadingCrud: false });

    if (error) throw new Error(error.message);

    set((state) => ({ subModules: [data, ...state.subModules] }));
  },

  getSubModuleById: async (id) => {
    set({ loading: true });

    const { data, error } = await supabase
      .from("view_sub_modules_with_module")
      .select("*")
      .eq("id", id)
      .single();

    set({ loading: false });

    if (error) {
      set({ selectedSubModule: null });
      console.error("Error fetching submodule:", error);
      return;
    }

    set({ selectedSubModule: data });
  },

  updateSubModule: async (updateInput) => {
    set({ loadingCrud: true });

    const { id, title, ...rest } = updateInput;
    const slug = title ? generateSlug(title) : undefined;
    const updatePayload = { ...rest, ...(title && { title, slug }) };

    const { data, error } = await supabase
      .from("sub_modules")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    set({ loadingCrud: false });

    if (error) throw new Error(error.message);

    set((state) => ({
      subModules: state.subModules.map((s) => (s.id === id ? data : s)),
      selectedSubModule: data,
    }));
  },

  deleteSubModule: async (id) => {
    set({ loadingCrud: true });

    const { error } = await supabase
      .from("sub_modules")
      .delete()
      .eq("id", id);

    set({ loadingCrud: false });

    if (error) throw new Error(error.message);

    set((state) => ({
      subModules: state.subModules.filter((s) => s.id !== id),
      selectedSubModule: state.selectedSubModule?.id === id ? null : state.selectedSubModule,
    }));
  },
}));
