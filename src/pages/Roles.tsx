import { useState } from 'react';
import { usePeers } from '../hooks/usePeers';
import { useRoles } from '../hooks/useRoles';
import { useAccessMatrix } from '../hooks/useAccessMatrix';
import { useAppContext } from '../context/AppContext';
import { Header } from '../components/Layout/Header';
import { Badge } from '../components/ui/Badge';
import { AddRoleModal } from '../components/modals/AddRoleModal';
import { EditRoleModal } from '../components/modals/EditRoleModal';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import type { IRole, IService } from '../models';
import './Roles.css';

export function Roles() {
  const { peers } = usePeers();
  const { filteredRoles, addRole, updateRole, removeRole } = useRoles();
  const { hasAccess, toggleAccess, getRuleCountDisplay } = useAccessMatrix();
  const { state } = useAppContext();

  const [expanded, setExpanded]        = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editRole, setEditRole]        = useState<IRole | null>(null);
  const [deleteRole, setDeleteRole]    = useState<IRole | null>(null);

  const toggleExpand = (roleId: string) =>
    setExpanded((prev) => (prev === roleId ? null : roleId));

  return (
    <>
      <Header title="Roles" subtitle="Define qué servicios accede cada perfil" />
      <div className="page-content">
        <div className="roles-page">
          <div className="roles-card">
            <div className="roles-header">
              <div>
                <h2>Roles ({filteredRoles.length})</h2>
                <div className="subtitle">Cada rol agrupa permisos por servicios</div>
              </div>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                + Nuevo rol
              </button>
            </div>

            <div className="roles-list">
              {filteredRoles.map((role) => {
                const peerCount = peers.filter((p) => p.roleId === role.id).length;
                const isExpanded = expanded === role.id;

                return (
                  <div key={role.id} className="role-item">
                    <div className="role-item-header" onClick={() => toggleExpand(role.id)}>
                      <div className="role-item-left">
                        <Badge label={role.displayName} color={role.color} />
                        <span className="role-item-description">{role.description}</span>
                      </div>
                      <div className="role-item-right">
                        <span>{peerCount} peer{peerCount !== 1 ? 's' : ''} · {getRuleCountDisplay(role.id)}</span>
                        <button
                          className="role-action-btn"
                          title="Editar rol"
                          onClick={(e) => { e.stopPropagation(); setEditRole(role); }}
                        >
                          ✎
                        </button>
                        <button
                          className="role-action-btn role-action-btn--danger"
                          title="Eliminar rol"
                          onClick={(e) => { e.stopPropagation(); setDeleteRole(role); }}
                        >
                          🗑
                        </button>
                        <span className={`role-item-chevron ${isExpanded ? 'expanded' : ''}`}>▾</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="role-item-content">
                        <div className="role-services-label">Acceso a servicios</div>
                        <div className="role-item-services">
                          {state.services.map((svc: IService) => {
                            const active = hasAccess(role.id, svc.id);
                            return (
                              <button
                                key={svc.id}
                                className={`role-service-toggle ${active ? 'active' : ''}`}
                                onClick={() => toggleAccess(role.id, svc.id)}
                                title={active ? 'Quitar acceso' : 'Dar acceso'}
                              >
                                <span className="toggle-dot" />
                                <span className="toggle-name">{svc.name}</span>
                                <span className="toggle-endpoint">{svc.url ?? svc.endpoint}</span>
                              </button>
                            );
                          })}
                          {state.services.length === 0 && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              Sin servicios configurados
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AddRoleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addRole}
      />

      <EditRoleModal
        role={editRole}
        onClose={() => setEditRole(null)}
        onSubmit={updateRole}
      />

      <ConfirmModal
        isOpen={!!deleteRole}
        onClose={() => setDeleteRole(null)}
        onConfirm={() => { if (deleteRole) return removeRole(deleteRole.id); }}
        title="Eliminar rol"
        message="¿Estás seguro de que deseas eliminar el rol"
        itemName={deleteRole?.displayName + '?'}
        confirmLabel="Eliminar"
        danger
      />
    </>
  );
}
