import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useRoles } from '../../hooks/useRoles';
import { useVpnUsers } from '../../hooks/useVpnUsers';
import type { NewPeerDTO } from '../../models';

interface AddPeerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewPeerDTO) => Promise<void>;
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

export function AddPeerModal({ isOpen, onClose, onSubmit }: AddPeerModalProps) {
  const { roles } = useRoles();
  const { users } = useVpnUsers();

  const [userId, setUserId]       = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [roleId, setRoleId]       = useState('');

  // Keep roleId in sync with default role
  useEffect(() => {
    if (!roleId && roles.length > 0) setRoleId(roles[0].id);
  }, [roles, roleId]);

  // When user is selected, pre-fill their role
  useEffect(() => {
    if (userId) {
      const user = users.find((u) => u.id === userId);
      if (user) setRoleId(user.roleId);
    }
  }, [userId, users]);

  const selectedUser = users.find((u) => u.id === userId);

  // Auto-generated WireGuard username preview
  const autoUsername = selectedUser && deviceName
    ? `${toSlug(selectedUser.displayName)}_${toSlug(deviceName)}`
    : '';

  // Auto-generated display name
  const autoDisplayName = selectedUser && deviceName
    ? `${selectedUser.displayName} · ${deviceName}`
    : '';

  const canSubmit = userId && deviceName.trim() && roleId;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onSubmit({
      displayName: autoDisplayName,
      username:    autoUsername,
      roleId,
      userId,
      deviceName:  deviceName.trim(),
    });
    setUserId('');
    setDeviceName('');
    setRoleId(roles[0]?.id ?? '');
    onClose();
  };

  return (
    <Modal
      title="Nuevo peer"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSubmit}>
            Agregar peer
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Usuario</label>
        <select
          className="form-select"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          autoFocus
        >
          <option value="">— Seleccionar usuario —</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.displayName} ({u.email})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Dispositivo</label>
        <input
          className="form-input"
          placeholder="MacBook Pro, iPhone 15, Smart TV…"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />
        {autoUsername && (
          <span className="form-hint">ID WireGuard: {autoUsername}</span>
        )}
      </div>

      <p className="form-hint">
        La IP se asigna automáticamente por WG-Easy al crear el peer.
      </p>

      <div className="form-group">
        <label>Rol</label>
        <select
          className="form-select"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.displayName}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
}
