import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useRoles } from '../../hooks/useRoles';
import { useVpnUsers } from '../../hooks/useVpnUsers';
import type { IPeer, UpdatePeerDTO } from '../../models';

interface EditPeerModalProps {
  peer: IPeer | null;
  onClose: () => void;
  onSubmit: (id: string, dto: UpdatePeerDTO) => Promise<void>;
}

export function EditPeerModal({ peer, onClose, onSubmit }: EditPeerModalProps) {
  const { roles } = useRoles();
  const { users } = useVpnUsers();

  const [displayName, setDisplayName] = useState('');
  const [deviceName, setDeviceName]   = useState('');
  const [ip, setIp]                   = useState('');
  const [roleId, setRoleId]           = useState('');
  const [userId, setUserId]           = useState('');

  useEffect(() => {
    if (peer) {
      setDisplayName(peer.displayName);
      setDeviceName(peer.deviceName ?? '');
      setIp(peer.ip);
      setRoleId(peer.roleId);
      setUserId(peer.userId ?? '');
    }
  }, [peer]);

  const handleSubmit = async () => {
    if (!peer) return;
    await onSubmit(peer.id, {
      displayName: displayName.trim(),
      deviceName:  deviceName.trim(),
      ip:          ip.trim(),
      roleId,
      userId:      userId || null,
    });
    onClose();
  };

  return (
    <Modal
      title="Editar peer"
      isOpen={!!peer}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Guardar cambios
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre</label>
        <input
          className="form-input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label>Dispositivo</label>
        <input
          className="form-input"
          placeholder="MacBook Pro, iPhone 15…"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Dirección IP</label>
        <input
          className="form-input"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
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
      <div className="form-group">
        <label>Usuario propietario</label>
        <select className="form-select" value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">— Sin usuario asignado —</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.displayName} ({u.email})</option>
          ))}
        </select>
      </div>
    </Modal>
  );
}
