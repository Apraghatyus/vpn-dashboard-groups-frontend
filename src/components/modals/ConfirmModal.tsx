import { useState } from 'react';
import { Modal } from '../ui/Modal';
import './modals.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (cascade?: boolean) => void | Promise<void>;
  title: string;
  message: string;
  itemName?: string;
  confirmLabel?: string;
  danger?: boolean;
  cascadeLabel?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmLabel = 'Confirmar',
  danger = false,
  cascadeLabel,
}: ConfirmModalProps) {
  const [cascade, setCascade] = useState(false);

  const handleConfirm = async () => {
    await onConfirm(cascadeLabel ? cascade : undefined);
    setCascade(false);
    onClose();
  };

  const handleClose = () => {
    setCascade(false);
    onClose();
  };

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={handleClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={handleClose}>
            Cancelar
          </button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="confirm-modal-text">
        {message}
        {itemName && (
          <> <span className="confirm-modal-name">{itemName}</span></>
        )}
      </p>
      {cascadeLabel && (
        <label className="confirm-modal-cascade">
          <input
            type="checkbox"
            checked={cascade}
            onChange={(e) => setCascade(e.target.checked)}
          />
          {cascadeLabel}
        </label>
      )}
    </Modal>
  );
}
