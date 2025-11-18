import React from "react";
import Modal from "./Modal";
import Button from "./Button";

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({ title, message, onConfirm, onCancel }) => {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Eliminar
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
