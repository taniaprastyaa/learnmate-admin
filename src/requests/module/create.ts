import { z } from "zod";
import type { NewModule } from "@/types";
import { useModuleStore } from "@/stores/moduleStore";

const createModuleSchema = z.object({
  title: z.string().min(2, { message: "Judul modul minimal 2 karakter" }).trim(),
  category_id: z.number().int({ message: "Kategori harus berupa angka bulat" }),
  summary: z.string().nullable().optional(),
  learning_benefits: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  thumbnail: z.url({ message: "URL thumbnail tidak valid" }),
});

export async function createModuleRequest(moduleData: Omit<NewModule, 'slug'>) {
  const result = createModuleSchema.safeParse(moduleData);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return { success: false, message: errorMessage };
  }

  const cleanedData: Omit<NewModule, 'slug'> = {
    ...result.data,
    summary: result.data.summary ?? null,
    learning_benefits: result.data.learning_benefits ?? null,
    description: result.data.description ?? null,
  };

  try {
    await useModuleStore.getState().createModule(cleanedData);
    return { success: true, message: "Modul berhasil ditambahkan" };
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        success: false,
        message: "Judul modul sudah digunakan, silakan pilih judul lain",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan saat menambahkan modul",
    };
  }
}
