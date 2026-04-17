import { useState } from 'react';
import { usePeers } from '../hooks/usePeers';
import { useRoles } from '../hooks/useRoles';
import { useAccessMatrix } from '../hooks/useAccessMatrix';
import { Header } from '../components/Layout/Header';
import { Badge } from '../components/ui/Badge';
import { AddRoleModal } from '../components/modals/AddRoleModal';
import './Roles.css';

export function Roles() {
  const { peers } = usePeers();
  const { filteredRoles, addRole } = useRoles();
  const { getServicesForRole, getRuleCountDisplay } = useAccessMatrix();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleExpand = (roleId: string) => {
    setExpanded((prev) => (prev === roleId ? null : roleId));
  };

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
                const services = getServicesForRole(role.id);
                const isExpanded = expanded === role.id;

                return (
                  <div key={role.id} className="role-item">
                    <div
                      className="role-item-header"
                      onClick={() => toggleExpand(role.id)}
                    >
                      <div className="role-item-left">
                        <Badge label={role.displayName} color={role.color} />
                        <span className="role-item-description">{role.description}</span>
                      </div>
                      <div className="role-item-right">
                        <span>{peerCount} peer{peerCount !== 1 ? 's' : ''} · {getRuleCountDisplay(role.id)}</span>
                        <span className={`role-item-chevron ${isExpanded ? 'expanded' : ''}`}>
                          ▾
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="role-item-content">
                        <div className="role-item-services">
                          {services.map((svc) => (
                            <div key={svc.id} className="role-service-tag">
                              {svc.name}
                              <span className="tag-endpoint">{svc.endpoint}</span>
                            </div>
                          ))}
                          {services.length === 0 && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              Sin servicios asignados
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
    </>
  );
}
