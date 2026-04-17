import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useRoles } from '../../hooks/useRoles';

interface AddPeerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { displayName: string; username: string; ip: string; roleId: string }) => void;
}

export function AddPeerModal({ isOpen, onClose, onSubmit }: AddPeerModalProps) {
  const { roles } = useRoles();
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [ip, setIp] = useState('');
  const [roleId, setRoleId] = useState(roles[0]?.id ?? '');

  const handleSubmit = () => {
    if (!displayName.trim() || !username.trim() || !ip.trim()) return;
    onSubmit({ displayName: displayName.trim(), username: username.trim(), ip: ip.trim(), roleId });
    setDisplayName('');
    setUsername('');
    setIp('');
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
          <button className="btn btn-primary" onClick={handleSubmit}>
            Agregar peer
          </button>
        </>
      }
    >
      <div className="form-group">
        <label>Nombre</label>
        <input
          className="form-input"
          placeholder="Juan Camilo · Owner"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label>Username</label>
        <input
          className="form-input"
          placeholder="apraghato"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Dirección IP</label>
        <input
          className="form-input"
          placeholder="10.8.0.7"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
      </div>
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
