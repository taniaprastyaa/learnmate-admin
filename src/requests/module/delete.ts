import { z } from "zod";
import { useModuleStore } from "@/stores/moduleStore";

const idSchema = z.number().int({ message: "ID modul tidak valid" });

export async function deleteModuleRequest(moduleId: number) {
  const result = idSchema.safeParse(moduleId);

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message };
  }

  try {
    await useModuleStore.getState().deleteModule(result.data);
    return { success: true, message: "Modul berhasil dihapus" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan saat menghapus modul",
    };
  }
}
