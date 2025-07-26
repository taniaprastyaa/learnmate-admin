import { useState } from "react";
import { toast } from "sonner";
import { ActionModal } from "@/components/dashboard/dialogs/action-modal";
import { DeleteConfirmationMessage } from "@/components/ui/delete-confirmation-message";
import { useSubModuleStore } from "@/stores/subModuleStore";
import { deleteSubModuleRequest } from "@/requests/sub-module/delete";

interface DeleteSubModuleDialogProps {
  open: boolean;
  onClose: () => void;
  subModuleId: number;
  subModuleTitle: string;
}

export function DeleteSubModuleDialog({
  open,
  onClose,
  subModuleId,
  subModuleTitle,
}: DeleteSubModuleDialogProps) {
  const [loading, setLoading] = useState(false);
  const { fetchSubModules } = useSubModuleStore();

  const handleDelete = async () => {
    setLoading(true);

    const result = await deleteSubModuleRequest(subModuleId);

    if (result.success) {
      toast.success(`Submodul "${subModuleTitle}" berhasil dihapus.`);
      await fetchSubModules(); // refresh data submodul
      onClose();
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      type="delete"
      title={`Hapus Submodul "${subModuleTitle}"?`}
      onSubmit={handleDelete}
      loading={loading}
    >
      <DeleteConfirmationMessage label={`submodul "${subModuleTitle}"`} />
    </ActionModal>
  );
}
