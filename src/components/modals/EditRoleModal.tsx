import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import type { IRole } from '../../models';

const COLOR_PRESETS = [
  '#ef4444', '#f59e0b', '#22c55e', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
];

interface EditRoleModalProps {
  role: IRole | null;
  onClose: () => void;
  onSubmit: (roleId: string, data: { displayName: string; description: string; color: string }) => Promise<void>;
}

export function EditRoleModal({ role, onClose, onSubmit }: EditRoleModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);

  useEffect(() => {
    if (role) {
      setName(role.displayName);
      setDescription(role.description);
      setColor(role.color);
    }
  }, [role]);

  const handleSubmit = async () => {
    if (!role || !name.trim()) return;
    await onSubmit(role.id, { displayName: name.trim(), description: description.trim(), color });
    onClose();
  };

  return (
    <Modal
      title="Editar rol"
      isOpen={!!role}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!name.trim()}>
            Guardar cambios
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre del rol</label>
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <input
          className="form-input"
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
