import { useState } from 'react';
import { usePeers } from '../hooks/usePeers';
import { useAccessMatrix } from '../hooks/useAccessMatrix';
import { Header } from '../components/Layout/Header';
import { Avatar } from '../components/ui/Avatar';
import { StatusDot } from '../components/ui/StatusDot';
import { RoleDropdown } from '../components/ui/RoleDropdown';
import { AddPeerModal } from '../components/modals/AddPeerModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import './Clientes.css';

export function Clientes() {
  const { filteredPeers, addPeer, updatePeerRole, removePeer } = usePeers();
  const { getRuleCountDisplay } = useAccessMatrix();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletePeer, setDeletePeer] = useState<{ id: string; name: string } | null>(null);

  return (
    <>
      <Header title="Clientes" subtitle="Peers conectados al túnel" />
      <div className="page-content">
        <div className="clientes">
          <div className="clientes-card">
            <div className="clientes-header">
              <div>
                <h2>Equipos ({filteredPeers.length})</h2>
                <div className="subtitle">Dispositivos autorizados al túnel</div>
              </div>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                + Nuevo peer
              </button>
            </div>
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>Peer</th>
                  <th>IP</th>
                  <th>Rol</th>
                  <th>Reglas</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredPeers.map((peer) => (
                  <tr key={peer.id}>
                    <td>
                      <div className="peer-cell">
                        <div className="peer-cell-avatar">
                          <Avatar name={peer.displayName} />
                          <StatusDot status={peer.status} />
                        </div>
                        <div className="peer-cell-info">
                          <span className="peer-cell-name">{peer.displayName}</span>
                          <span className="peer-cell-username">
                            {peer.deviceName ? `${peer.deviceName} · ${peer.username}` : peer.username}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="peer-ip">{peer.ip}</span>
                    </td>
                    <td>
                      <RoleDropdown
                        currentRoleId={peer.roleId}
                        onChange={(roleId) => updatePeerRole(peer.id, roleId)}
                      />
                    </td>
                    <td>
                      <span className="peer-rules">{getRuleCountDisplay(peer.roleId)}</span>
                    </td>
                    <td>
                      <span className="peer-time">{peer.lastSeen}</span>
                    </td>
                    <td>
                      <button
                        className="peer-delete"
                        onClick={() => setDeletePeer({ id: peer.id, name: peer.displayName })}
                        title="Eliminar peer"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddPeerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addPeer}
      />

      <ConfirmModal
        isOpen={!!deletePeer}
        onClose={() => setDeletePeer(null)}
        onConfirm={() => { if (deletePeer) return removePeer(deletePeer.id); }}
        title="Eliminar peer"
        message="¿Estás seguro de que deseas eliminar el peer"
        itemName={deletePeer?.name + '?'}
        confirmLabel="Eliminar"
        danger
      />
    </>
  );
}
