import { NavLink } from 'react-router-dom';
import { usePeers } from '../../hooks/usePeers';
import { useRoles } from '../../hooks/useRoles';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export function Sidebar() {
  const { peers, onlineCount } = usePeers();
  const { roles } = useRoles();
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">O</div>
        <div className="sidebar-brand-text">
          <h2>WG-ACL</h2>
          <span>apraghatyus-dns</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          Overview
        </NavLink>
        <NavLink to="/clientes" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Clientes
        </NavLink>
        <NavLink to="/roles" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Roles
        </NavLink>
        <NavLink to="/matriz" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          Matriz de acceso
        </NavLink>
        <NavLink to="/yaml" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          YAML
        </NavLink>
      </nav>

      {/* Footer Status */}
      <div className="sidebar-footer">
        <div className="sidebar-status">
          <div className="sidebar-status-row">
            <span className="sidebar-status-label">Tunnel</span>
            <span className="sidebar-status-value active">⊙ activo</span>
          </div>
          <div className="sidebar-status-row">
            <span className="sidebar-status-label">Peers online</span>
            <span className="sidebar-status-value">{onlineCount}/{peers.length}</span>
          </div>
          <div className="sidebar-status-row">
            <span className="sidebar-status-label">Roles</span>
            <span className="sidebar-status-value">{roles.length}</span>
          </div>
        </div>
        {user && (
          <button className="sidebar-logout" onClick={logout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Cerrar sesión · {user.username}
          </button>
        )}
        <div className="sidebar-ip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          100.114.140.34 · 51820/udp
        </div>
      </div>
    </aside>
  );
}
