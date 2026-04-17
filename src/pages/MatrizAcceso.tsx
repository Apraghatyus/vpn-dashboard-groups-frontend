import { useRoles } from '../hooks/useRoles';
import { useServices } from '../hooks/useServices';
import { useAccessMatrix } from '../hooks/useAccessMatrix';
import { Header } from '../components/Layout/Header';
import './MatrizAcceso.css';

export function MatrizAcceso() {
  const { roles } = useRoles();
  const { services } = useServices();
  const { hasAccess, toggleAccess } = useAccessMatrix();

  return (
    <>
      <Header title="Matriz de acceso" subtitle="Cruce visual de roles × servicios" />
      <div className="page-content">
        <div className="matriz-page">
          <div className="matriz-card">
            <div className="matriz-header">
              <h2>Matriz de acceso</h2>
              <div className="subtitle">Click en una celda para alternar el permiso</div>
            </div>
            <table className="matriz-table">
              <thead>
                <tr>
                  <th>Servicio</th>
                  {roles.map((role) => (
                    <th key={role.id}>
                      <div className="matriz-role-header">
                        <span className="matriz-role-dot" style={{ background: role.color }} />
                        {role.displayName}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((svc) => (
                  <tr key={svc.id}>
                    <td>
                      <div className="matriz-service">
                        <span className="matriz-service-dot" />
                        <div className="matriz-service-info">
                          <span className="matriz-service-name">{svc.name}</span>
                          <span className="matriz-service-endpoint">{svc.endpoint}</span>
                        </div>
                      </div>
                    </td>
                    {roles.map((role) => {
                      const access = hasAccess(role.id, svc.id);
                      return (
                        <td key={role.id}>
                          <span
                            className={`matriz-access ${access ? 'has-access' : 'no-access'}`}
                            onClick={() => toggleAccess(role.id, svc.id)}
                            style={access ? { color: role.color } : undefined}
                          >
                            {access ? '✓' : '—'}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
