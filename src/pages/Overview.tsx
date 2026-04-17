import { Link } from 'react-router-dom';
import { usePeers } from '../hooks/usePeers';
import { useRoles } from '../hooks/useRoles';
import { useServices } from '../hooks/useServices';
import { useAccessMatrix } from '../hooks/useAccessMatrix';
import { Header } from '../components/Layout/Header';
import './Overview.css';

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'amber',
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: React.ReactNode;
  tone?: 'amber' | 'info' | 'success' | 'violet';
}) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-card-inner">
        <div>
          <div className="stat-card-label">{label}</div>
          <div className="stat-card-value">{value}</div>
          {hint && <div className="stat-card-hint">{hint}</div>}
        </div>
        <div className={`stat-card-icon tone-${tone}`}>{icon}</div>
      </div>
    </div>
  );
}

/* ── Icons (inline SVGs) ── */
const UsersIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ShieldIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ServerIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const ActivityIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export function Overview() {
  const { peers, onlineCount } = usePeers();
  const { roles, getRoleColor, getRoleById } = useRoles();
  const { byCategory, getCategoryColor, totalCount } = useServices();
  const { getRuleCount } = useAccessMatrix();

  // Total rules across all roles
  const totalRules = roles.reduce((acc, role) => {
    const count = getRuleCount(role.id);
    return acc + (count === totalCount ? totalCount : count);
  }, 0);

  return (
    <>
      <Header title="Overview" subtitle="Estado general de la red WireGuard" />
      <div className="page-content">
        <div className="overview">

          {/* ── 4 Stat Cards ── */}
          <div className="stat-grid">
            <StatCard
              label="Peers"
              value={peers.length}
              hint={`${onlineCount} online`}
              icon={UsersIcon}
              tone="info"
            />
            <StatCard
              label="Roles"
              value={roles.length}
              hint="perfiles definidos"
              icon={ShieldIcon}
              tone="amber"
            />
            <StatCard
              label="Servicios"
              value={totalCount}
              hint="endpoints expuestos"
              icon={ServerIcon}
              tone="violet"
            />
            <StatCard
              label="Reglas activas"
              value={totalRules}
              hint="aplicadas en ACL"
              icon={ActivityIcon}
              tone="success"
            />
          </div>

          {/* ── Peers + Categories ── */}
          <div className="overview-mid">
            {/* Peers recientes */}
            <div className="ov-card">
              <div className="ov-card-header">
                <div>
                  <h3>Peers recientes</h3>
                  <p>Últimas conexiones al túnel</p>
                </div>
                <Link to="/clientes" className="ov-card-header-link">
                  Ver todos
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </Link>
              </div>
              <div className="ov-peers-list">
                {peers.slice(0, 5).map((peer) => {
                  const role = getRoleById(peer.roleId);
                  const color = getRoleColor(peer.roleId);
                  return (
                    <div key={peer.id} className="ov-peer-row">
                      <div className="ov-peer-avatar">
                        {peer.displayName.charAt(0).toUpperCase()}
                        <span className={`ov-peer-status ${peer.status}`} />
                      </div>
                      <div className="ov-peer-info">
                        <div className="ov-peer-name">{peer.displayName}</div>
                        <div className="ov-peer-username">{peer.username}</div>
                      </div>
                      <div className="ov-peer-meta">
                        {role && (
                          <span
                            className="role-chip"
                            style={{
                              color: color,
                              borderColor: `${color}40`,
                              background: `${color}12`,
                            }}
                          >
                            {role.displayName}
                          </span>
                        )}
                        <span className="ov-peer-ip">{peer.ip}</span>
                        <span className="ov-peer-time">{peer.lastSeen}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Services by category */}
            <div className="ov-card">
              <div className="ov-card-header">
                <div>
                  <h3>Servicios por categoría</h3>
                  <p>{totalCount} endpoints</p>
                </div>
              </div>
              <div className="ov-categories">
                {Object.entries(byCategory).map(([cat, services]) => {
                  const color = getCategoryColor(cat as any);
                  const pct = totalCount > 0 ? (services.length / totalCount) * 100 : 0;
                  return (
                    <div key={cat} className="ov-cat-item">
                      <div className="ov-cat-header">
                        <span className="ov-cat-label">
                          <span className="ov-cat-dot" style={{ color }}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="12" r="5" />
                            </svg>
                          </span>
                          {cat}
                        </span>
                        <span className="ov-cat-count">{services.length}</span>
                      </div>
                      <div className="ov-cat-bar">
                        <div
                          className="ov-cat-bar-fill"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Role Distribution ── */}
          <div className="ov-card">
            <div className="ov-card-header">
              <div>
                <h3>Distribución de roles</h3>
                <p>Cobertura de cada perfil sobre los servicios</p>
              </div>
            </div>
            <div className="ov-distribution-grid">
              {roles.map((role) => {
                const peerCount = peers.filter((p) => p.roleId === role.id).length;
                const ruleCount = getRuleCount(role.id);
                const pct = totalCount > 0 ? (ruleCount / totalCount) * 100 : 0;
                return (
                  <div key={role.id} className="ov-dist-card">
                    <div className="ov-dist-header">
                      <span
                        className="role-chip"
                        style={{
                          color: role.color,
                          borderColor: `${role.color}40`,
                          background: `${role.color}12`,
                        }}
                      >
                        <span className="chip-dot" style={{ background: role.color }} />
                        {role.displayName}
                      </span>
                      <span className="ov-dist-peers">{peerCount} peers</span>
                    </div>
                    <div className="ov-dist-value">
                      <span className="big">{ruleCount}</span>
                      <span className="total">/ {totalCount} servicios</span>
                    </div>
                    <div className="ov-dist-bar">
                      <div
                        className="ov-dist-bar-fill"
                        style={{ width: `${pct}%`, background: role.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
