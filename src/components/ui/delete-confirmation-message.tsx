interface DeleteConfirmationMessageProps {
    label: string;
  }
  
  export function DeleteConfirmationMessage({ label }: DeleteConfirmationMessageProps) {
    return (
      <p>
        Apakah Anda yakin ingin menghapus <strong>{label}</strong>? Tindakan ini akan secara permanen menghapus data.
      </p>
    );
  }
  