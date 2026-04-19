import { useVpnUsers } from '../hooks/useVpnUsers';
import { useRoles } from '../hooks/useRoles';
import { Header } from '../components/Layout/Header';
import './VpnUsers.css';

export function VpnUsers() {
  const { users, getUserDevices } = useVpnUsers();
  const { getRoleById, getRoleColor } = useRoles();

  return (
    <>
      <Header title="Usuarios VPN" subtitle="Personas autorizadas para conectarse y sus dispositivos" />
      <div className="page-content">
        <div className="header-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button className="btn btn-primary" onClick={() => alert('Próximamente: Crear usuario')}>
            + Nuevo Usuario
          </button>
        </div>
        
        <div className="users-grid">
          {users.map(user => {
            const role = getRoleById(user.roleId);
            const color = getRoleColor(user.roleId);
            const devices = getUserDevices(user.id);
            const initials = user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            return (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar" style={{ background: color }}>
                    {initials}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.displayName}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
                
                <div className="user-meta">
                  <span 
                    className="user-role role-chip" 
                    style={{ 
                      color, 
                      background: `${color}12`, 
                      borderColor: `${color}40`,
                      border: '1px solid'
                    }}
                  >
                    {role?.displayName || user.roleId}
                  </span>
                  <span className="user-devices">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                    {devices.length} disp.
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
