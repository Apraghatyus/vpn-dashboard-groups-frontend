import { useState, useCallback } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useAuth } from '../../context/AuthContext';
import { usePeers } from '../../hooks/usePeers';
import './Header.css';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { searchQuery, setSearch } = useSearch();
  const { token } = useAuth();
  const { reconcileWgEasy } = usePeers();
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'done' | 'error'>('idle');
  const [reconcileState, setReconcileState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [reconcileResult, setReconcileResult] = useState<{ linked: number; orphaned: number; adopted_pending: number } | null>(null);

  const handleSync = useCallback(async () => {
    if (!token || syncState === 'syncing') return;
    setSyncState('syncing');
    try {
      const res = await fetch('/api/yaml/sync', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setSyncState(res.ok ? 'done' : 'error');
    } catch {
      setSyncState('error');
    }
    setTimeout(() => setSyncState('idle'), 3000);
  }, [token, syncState]);

  const handleReconcile = useCallback(async () => {
    if (reconcileState === 'running') return;
    setReconcileState('running');
    setReconcileResult(null);
    try {
      const result = await reconcileWgEasy();
      setReconcileResult(result);
      setReconcileState('done');
    } catch {
      setReconcileState('error');
    }
    setTimeout(() => setReconcileState('idle'), 5000);
  }, [reconcileState, reconcileWgEasy]);

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-title">
          <h1>
            {title}
            <span className="header-branch">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="3" x2="6" y2="15" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="M18 9a9 9 0 0 1-9 9" />
              </svg>
              main
            </span>
          </h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="header-right">
        <div className="header-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="header-search-shortcut">⌘K</span>
        </div>
        <button
          className={`header-sync ${reconcileState}`}
          onClick={handleReconcile}
          disabled={reconcileState === 'running'}
          title={reconcileResult ? `Linked: ${reconcileResult.linked}, Orphaned: ${reconcileResult.orphaned}, Adopted: ${reconcileResult.adopted_pending}` : undefined}
        >
          {reconcileState === 'running' ? (
            <>⟳ Reconciliando...</>
          ) : reconcileState === 'done' ? (
            <>✓ Reconciled</>
          ) : reconcileState === 'error' ? (
            <>✕ Error</>
          ) : (
            <>⇄ Reconcile WG-Easy</>
          )}
        </button>
        <button
          className={`header-sync ${syncState}`}
          onClick={handleSync}
          disabled={syncState === 'syncing'}
        >
          {syncState === 'syncing' ? (
            <>⟳ Aplicando...</>
          ) : syncState === 'done' ? (
            <>✓ ACL Aplicada</>
          ) : syncState === 'error' ? (
            <>✕ Error</>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Sincronizar
            </>
          )}
        </button>
      </div>
    </header>
  );
}
