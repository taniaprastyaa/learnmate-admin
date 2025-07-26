import { z } from "zod";
import { useCategoryStore } from "@/stores/categoryStore";
import type { NewCategory } from "@/types";

const createCategorySchema = z.object({
  category_name: z
    .string()
    .min(2, { message: "Nama kategori minimal 2 karakter" })
    .trim(),
});

export async function createCategoryRequest(categoryData: NewCategory) {
  const result = createCategorySchema.safeParse(categoryData);

  if (!result.success) {
    const errorMessage = result.error.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return { success: false, message: errorMessage };
  }

  const cleanedData: NewCategory = {
    category_name: result.data.category_name,
  };

  try {
    await useCategoryStore.getState().createCategory(cleanedData);
    return { success: true, message: "Kategori berhasil ditambahkan" };
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        success: false,
        message: "Nama kategori sudah digunakan, silahkan pilih nama lain",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan saat menambahkan kategori",
    };
  }
}
