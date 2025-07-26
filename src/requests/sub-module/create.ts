import { z } from "zod";
import type { NewSubModule } from "@/types";
import { useSubModuleStore } from "@/stores/subModuleStore";

const learningResourceSchema = z.object({
  label: z.string().min(1, { message: "Label sumber belajar wajib diisi" }),
  url: z.url({ message: "URL sumber belajar tidak valid" }),
});

const selfLearningSchema = z.object({
  explanation: z.string().min(1, { message: "Penjelasan self-learning wajib diisi" }),
  url: z.url({ message: "URL self-learning tidak valid" }),
});

const createSubModuleSchema = z.object({
  module_id: z.number().int({ message: "ID modul harus berupa angka bulat" }),
  title: z.string().min(1, { message: "Judul submodul wajib diisi" }),
  description: z.string().min(5, { message: "Deskripsi minimal 5 karakter" }),
  duration_minutes: z.number().int({ message: "Durasi harus berupa angka bulat" }),
  objectives: z.string().min(1, { message: "Tujuan harus diisi" }),
  requirements: z.string().min(1, { message: "Persyaratan harus diisi" }),
  learning_resources: z.array(learningResourceSchema),
  self_learning: z.array(selfLearningSchema),
  order: z.number().int({ message: "Urutan harus berupa angka bulat" }),
  sub_module_materials: z.string().min(1, { message: "Materi wajib diisi" }),
  youtube_url: z.url({ message: "URL YouTube tidak valid" }),
});

export async function createSubModuleRequest(
  input: Omit<NewSubModule, "slug">
) {
  const result = createSubModuleSchema.safeParse(input);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return { success: false, message: errorMessage };
  }

  const cleanedData: Omit<NewSubModule, "slug"> = {
    ...result.data,
  };

  try {
    await useSubModuleStore.getState().createSubModule(cleanedData);
    return { success: true, message: "Submodul berhasil ditambahkan" };
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        success: false,
        message: "Submodul dengan judul serupa sudah ada",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan saat menambahkan submodul",
    };
  }
}
