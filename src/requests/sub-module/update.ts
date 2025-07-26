import { z } from "zod";
import type { UpdateSubModule } from "@/types";
import { useSubModuleStore } from "@/stores/subModuleStore";

const learningResourceSchema = z.object({
  label: z.string().min(1, { message: "Label sumber belajar wajib diisi" }),
  url: z.url({ message: "URL sumber belajar tidak valid" }),
});

const selfLearningSchema = z.object({
  explanation: z.string().min(1, { message: "Penjelasan self-learning wajib diisi" }),
  url: z.url({ message: "URL self-learning tidak valid" }),
});

const updateSubModuleSchema = z.object({
  id: z.number().int({ message: "ID submodul harus berupa angka bulat" }),
  module_id: z.number().int().optional(),
  title: z.string().min(1, { message: "Judul submodul wajib diisi" }),
  description: z.string().min(5, { message: "Deskripsi minimal 5 karakter" }).optional(),
  duration_minutes: z.number().int().optional(),
  objectives: z.string().optional(),
  requirements: z.string().optional(),
  learning_resources: z.array(learningResourceSchema).optional(),
  self_learning: z.array(selfLearningSchema).optional(),
  order: z.number().int().optional(),
  sub_module_materials: z.string().optional(),
  youtube_url: z.url({ message: "URL YouTube tidak valid" }).optional(),
});

export async function updateSubModuleRequest(updateInput: UpdateSubModule) {
  const result = updateSubModuleSchema.safeParse(updateInput);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return { success: false, message: errorMessage };
  }

  const cleanedData: UpdateSubModule = {
    ...result.data,
  };

  try {
    await useSubModuleStore.getState().updateSubModule(cleanedData);
    return { success: true, message: "Submodul berhasil diperbarui" };
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        success: false,
        message: "Submodul dengan deskripsi serupa sudah ada",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan saat memperbarui submodul",
    };
  }
}
