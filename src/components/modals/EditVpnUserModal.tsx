import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useRoles } from '../../hooks/useRoles';
import type { IVpnUser, UpdateVpnUserDTO } from '../../models';

interface EditVpnUserModalProps {
  user: IVpnUser | null;
  onClose: () => void;
  onSubmit: (id: string, dto: UpdateVpnUserDTO) => Promise<void>;
}

export function EditVpnUserModal({ user, onClose, onSubmit }: EditVpnUserModalProps) {
  const { roles } = useRoles();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail]             = useState('');
  const [roleId, setRoleId]           = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setEmail(user.email);
      setRoleId(user.roleId);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!user || !displayName.trim()) return;
    await onSubmit(user.id, { displayName: displayName.trim(), email: email.trim(), roleId });
    onClose();
  };

  return (
    <Modal
      title="Editar usuario VPN"
      isOpen={!!user}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!displayName.trim()}>
            Guardar cambios
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre completo</label>
        <input
          className="form-input"
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
