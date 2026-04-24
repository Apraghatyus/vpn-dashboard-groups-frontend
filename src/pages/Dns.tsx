import { useDns } from '../hooks/useDns';
import { Header } from '../components/Layout/Header';
import './Dns.css';

export function DnsView() {
  const { records, loading, syncAll } = useDns();

  return (
    <>
      <Header title="DNS & AdGuard" subtitle="Gestión de dominios internos (.home.local)" />
      <div className="page-content">
        <div className="dns-container">
          <div className="dns-header">
            <div>
              <h2>Registros Locales</h2>
              <div className="dns-subtitle">Respuestas locales sincronizadas con AdGuard Home</div>
            </div>
            <button 
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              onClick={syncAll}
              disabled={loading}
            >
              {loading ? 'Sincronizando...' : 'Sincronizar en AdGuard'}
            </button>
          </div>
          
          <table className="dns-table">
            <thead>
              <tr>
                <th>Dominio</th>
                <th>Tipo</th>
                <th>Respuesta (IP / Destino)</th>
                <th>Descripción</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id}>
                  <td>
                    <span className="dns-domain">{record.domain}</span>
                  </td>
                  <td>
                    <span className={`dns-type-badge ${record.type === 'A' ? 'type-a' : 'type-cname'}`}>
                      {record.type}
                    </span>
                  </td>
                  <td>
                    <span className="dns-answer">{record.answer}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {record.description}
                    </span>
                  </td>
                  <td>
                    <div className={`dns-sync-status ${record.adguardSynced ? 'synced' : 'pending'}`}>
                      {record.adguardSynced ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Sincronizado
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          Pendiente
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No hay registros DNS configurados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
