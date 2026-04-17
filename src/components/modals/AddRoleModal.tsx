import { useState } from 'react';
import { Modal } from '../ui/Modal';

const COLOR_PRESETS = [
  '#ef4444', '#f59e0b', '#22c55e', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
];

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { id: string; displayName: string; description: string; color: string }) => Promise<void>;
}

export function AddRoleModal({ isOpen, onClose, onSubmit }: AddRoleModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const id = name.trim().toLowerCase().replace(/\s+/g, '_');
    await onSubmit({ id, displayName: name.trim(), description: description.trim(), color });
    setName('');
    setDescription('');
    setColor(COLOR_PRESETS[0]);
    onClose();
  };

  return (
    <Modal
      title="Nuevo rol"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Crear rol
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre del rol</label>
        <input
          className="form-input"
          placeholder="visitante"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <input
          className="form-input"
          placeholder="Acceso limitado para visitantes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Color</label>
        <div className="color-options">
          {COLOR_PRESETS.map((c) => (
            <button
              key={c}
              className={`color-option ${color === c ? 'selected' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              type="button"
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
