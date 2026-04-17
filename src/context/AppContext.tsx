import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { IPeer, IRole, IService, IAccessEntry } from '../models';
import { apiFetch } from '../lib/api';

/* ── State ── */
export interface AppState {
  peers: IPeer[];
  roles: IRole[];
  services: IService[];
  accessMatrix: IAccessEntry[];
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

/* ── Actions ── */
export type Action =
  | { type: 'SET_PEERS'; payload: IPeer[] }
  | { type: 'ADD_PEER_RESPONSE'; payload: IPeer }
  | { type: 'REMOVE_PEER'; payload: string }
  | { type: 'UPDATE_PEER_ROLE'; payload: { peerId: string; roleId: string } }
  | { type: 'SET_ROLES'; payload: IRole[] }
  | { type: 'ADD_ROLE_RESPONSE'; payload: IRole }
  | { type: 'REMOVE_ROLE'; payload: string }
  | { type: 'SET_SERVICES'; payload: IService[] }
  | { type: 'SET_ACCESS_MATRIX'; payload: IAccessEntry[] }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

/* ── Reducer ── */
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PEERS':
      return { ...state, peers: action.payload };

    case 'ADD_PEER_RESPONSE':
      return { ...state, peers: [...state.peers, action.payload] };

    case 'REMOVE_PEER':
      return { ...state, peers: state.peers.filter((p) => p.id !== action.payload) };

    case 'UPDATE_PEER_ROLE':
      return {
        ...state,
        peers: state.peers.map((p) =>
          p.id === action.payload.peerId ? { ...p, roleId: action.payload.roleId } : p
        ),
      };

    case 'SET_ROLES':
      return { ...state, roles: action.payload };

    case 'ADD_ROLE_RESPONSE':
      return { ...state, roles: [...state.roles, action.payload] };

    case 'REMOVE_ROLE':
      return {
        ...state,
        roles: state.roles.filter((r) => r.id !== action.payload),
        accessMatrix: state.accessMatrix.filter((e) => e.roleId !== action.payload),
        peers: state.peers.map((p) =>
          p.roleId === action.payload ? { ...p, roleId: state.roles[0]?.id ?? '' } : p
        ),
      };

    case 'SET_SERVICES':
      return { ...state, services: action.payload };

    case 'SET_ACCESS_MATRIX':
      return { ...state, accessMatrix: action.payload };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

/* ── Initial state ── */
const initialState: AppState = {
  peers: [],
  roles: [],
  services: [],
  accessMatrix: [],
  searchQuery: '',
  loading: true,
  error: null,
};

/* ── Context ── */
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

/* ── Provider ── */
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function load() {
      try {
        const [peers, roles, services, accessMatrix] = await Promise.all([
          apiFetch<IPeer[]>('/api/peers'),
          apiFetch<IRole[]>('/api/roles'),
          apiFetch<IService[]>('/api/services'),
          apiFetch<IAccessEntry[]>('/api/access'),
        ]);
        dispatch({ type: 'SET_PEERS', payload: peers });
        dispatch({ type: 'SET_ROLES', payload: roles });
        dispatch({ type: 'SET_SERVICES', payload: services });
        dispatch({ type: 'SET_ACCESS_MATRIX', payload: accessMatrix });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Error cargando datos del servidor' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    load();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {state.loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)' }}>
          Cargando…
        </div>
      ) : state.error ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--danger, #ef4444)' }}>
          {state.error}
        </div>
      ) : (
        children
      )}
    </AppContext.Provider>
  );
}

/* ── Hook ── */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
