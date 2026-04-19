import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useRoles } from '../../hooks/useRoles';
import type { NewVpnUserDTO } from '../../models';

interface AddVpnUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: NewVpnUserDTO) => Promise<void>;
}

export function AddVpnUserModal({ isOpen, onClose, onSubmit }: AddVpnUserModalProps) {
  const { roles } = useRoles();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail]             = useState('');
  const [roleId, setRoleId]           = useState('');

  useEffect(() => {
    if (!roleId && roles.length > 0) setRoleId(roles[0].id);
  }, [roles, roleId]);

  const canSubmit = displayName.trim() && email.trim() && roleId;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onSubmit({ displayName: displayName.trim(), email: email.trim(), roleId });
    setDisplayName('');
    setEmail('');
    setRoleId(roles[0]?.id ?? '');
    onClose();
  };

  return (
    <Modal
      title="Nuevo usuario VPN"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSubmit}>
            Crear usuario
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre completo</label>
        <input
          className="form-input"
          placeholder="Juan Camilo Cardona"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          className="form-input"
          type="email"
          placeholder="usuario@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Rol</label>
        <select className="form-select" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.displayName}</option>
          ))}
        </select>
      </div>
    </Modal>
  );
}
