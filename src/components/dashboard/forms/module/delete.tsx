import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import { useModuleStore } from "@/stores/moduleStore";
import { useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmationMessage } from "@/components/ui/delete-confirmation-message";

interface DeleteModuleDialogProps {
  open: boolean;
  onClose: () => void;
  moduleId: number;
  moduleTitle: string;
}

export function DeleteModuleDialog({
  open,
  onClose,
  moduleId,
  moduleTitle,
}: DeleteModuleDialogProps) {
  const { deleteModule, fetchModules } = useModuleStore();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteModule(moduleId);
      await fetchModules(); // refresh modul setelah hapus
      toast.success(`Modul "${moduleTitle}" berhasil dihapus.`);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Gagal menghapus modul.");
      }
    }

    setLoading(false);
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      type="delete"
      title={`Hapus Modul "${moduleTitle}"?`}
      onSubmit={handleDelete}
      loading={loading}
    >
      <DeleteConfirmationMessage label={`modul "${moduleTitle}"`} />
    </ActionModal>
  );
}