import { z } from "zod";
import { useCategoryStore } from "@/stores/categoryStore";

const idSchema = z.number().int({ message: "ID kategori tidak valid" });

export async function deleteCategoryRequest(categoryId: number) {
  const result = idSchema.safeParse(categoryId);

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message };
  }

  try {
    await useCategoryStore.getState().deleteCategory(result.data);
    return { success: true, message: "Kategori berhasil dihapus" };
  } catch (error) {
    if (error instanceof Error && error.message === "CATEGORY_USED_IN_EXPENSES") {
      return {
        success: false,
        message: "Kategori tidak dapat dihapus karena sudah digunakan dalam produksi",
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan saat menghapus kategori",
    };
  }
}
