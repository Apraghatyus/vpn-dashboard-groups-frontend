import { useState } from 'react';
import { useVpnUsers } from '../hooks/useVpnUsers';
import { useRoles } from '../hooks/useRoles';
import { useAppContext } from '../context/AppContext';
import { Header } from '../components/Layout/Header';
import { AddVpnUserModal } from '../components/modals/AddVpnUserModal';
import { EditVpnUserModal } from '../components/modals/EditVpnUserModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import type { IVpnUser } from '../models';
import './VpnUsers.css';

export function VpnUsers() {
  const { users, addUser, updateUser, removeUser } = useVpnUsers();
  const { getRoleById, getRoleColor } = useRoles();
  const { state } = useAppContext();

  const [showAddModal, setShowAddModal]   = useState(false);
  const [editUser, setEditUser]           = useState<IVpnUser | null>(null);
  const [deleteUser, setDeleteUser]       = useState<IVpnUser | null>(null);

  const getDeviceCount = (userId: string) =>
    state.peers.filter((p) => p.userId === userId).length;

  return (
    <>
      <Header title="Usuarios VPN" subtitle="Personas autorizadas para conectarse y sus dispositivos" />
      <div className="page-content">
        <div className="users-toolbar">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Nuevo usuario
          </button>
        </div>

        <div className="users-grid">
          {users.map((user) => {
            const role       = getRoleById(user.roleId);
            const color      = getRoleColor(user.roleId);
            const deviceCount = getDeviceCount(user.id);
            const initials   = user.displayName
              .split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();

            return (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar" style={{ background: color }}>{initials}</div>
                  <div className="user-info">
                    <div className="user-name">{user.displayName}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <div className="user-actions">
                    <button
                      className="user-action-btn"
                      title="Editar usuario"
                      onClick={() => setEditUser(user)}
                    >✎</button>
                    <button
                      className="user-action-btn user-action-btn--danger"
                      title="Eliminar usuario"
                      onClick={() => setDeleteUser(user)}
                    >🗑</button>
                  </div>
                </div>

                <div className="user-meta">
                  <span
                    className="user-role role-chip"
                    style={{ color, background: `${color}12`, borderColor: `${color}40`, border: '1px solid' }}
                  >
                    {role?.displayName || user.roleId}
                  </span>
                  <span className="user-devices">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    {deviceCount} disp.
                  </span>
                </div>
              </div>
            );
          })}

          {users.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No hay usuarios VPN registrados.
            </p>
          )}
        </div>
      </div>

      <AddVpnUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addUser}
      />

      <EditVpnUserModal
        user={editUser}
        onClose={() => setEditUser(null)}
        onSubmit={updateUser}
      />

      <ConfirmModal
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={(cascade) => { if (deleteUser) return removeUser(deleteUser.id, cascade ?? false); }}
        title="Eliminar usuario"
        message="¿Estás seguro de que deseas eliminar al usuario"
        itemName={deleteUser?.displayName + '?'}
        confirmLabel="Eliminar"
        danger
        cascadeLabel="Eliminar también todos sus dispositivos"
      />
    </>
  );
}
