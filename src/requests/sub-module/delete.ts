import { useSubModuleStore } from "@/stores/subModuleStore";
import { z } from "zod";

const idSchema = z.number().int({ message: "ID submodul tidak valid" });

export async function deleteSubModuleRequest(subModuleId: number) {
  const result = idSchema.safeParse(subModuleId);

  if (!result.success) {
    return { success: false, message: result.error.issues[0].message };
  }

  try {
    await useSubModuleStore.getState().deleteSubModule(result.data);
    return { success: true, message: "Submodul berhasil dihapus" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `Terjadi kesalahan: ${error.message}`
          : "Terjadi kesalahan saat menghapus submodul",
    };
  }
}