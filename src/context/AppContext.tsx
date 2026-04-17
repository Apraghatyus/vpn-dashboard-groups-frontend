import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { IPeer, IRole, IService, IAccessEntry, NewPeerDTO, NewRoleDTO } from '../models';
import { storageService } from '../services/storage.service';
import { MOCK_PEERS, MOCK_ROLES, MOCK_SERVICES, MOCK_ACCESS_MATRIX } from '../data/mockData';

/* ── State ── */
export interface AppState {
  peers: IPeer[];
  roles: IRole[];
  services: IService[];
  accessMatrix: IAccessEntry[];
  searchQuery: string;
}

/* ── Actions ── */
export type Action =
  | { type: 'SET_PEERS'; payload: IPeer[] }
  | { type: 'ADD_PEER'; payload: NewPeerDTO }
  | { type: 'REMOVE_PEER'; payload: string }
  | { type: 'UPDATE_PEER_ROLE'; payload: { peerId: string; roleId: string } }
  | { type: 'SET_ROLES'; payload: IRole[] }
  | { type: 'ADD_ROLE'; payload: NewRoleDTO }
  | { type: 'REMOVE_ROLE'; payload: string }
  | { type: 'SET_SERVICES'; payload: IService[] }
  | { type: 'SET_ACCESS_MATRIX'; payload: IAccessEntry[] }
  | { type: 'TOGGLE_ACCESS'; payload: { roleId: string; serviceId: string } }
  | { type: 'SET_SEARCH'; payload: string };

/* ── Reducer ── */
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PEERS':
      return { ...state, peers: action.payload };

    case 'ADD_PEER': {
      const newPeer: IPeer = {
        ...action.payload,
        id: `peer-${Date.now()}`,
        status: 'offline',
        lastSeen: 'ahora',
        createdAt: Date.now(),
      };
      return { ...state, peers: [...state.peers, newPeer] };
    }

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

    case 'ADD_ROLE': {
      const newRole: IRole = {
        ...action.payload,
        createdAt: Date.now(),
      };
      return { ...state, roles: [...state.roles, newRole] };
    }

    case 'REMOVE_ROLE':
      return {
        ...state,
        roles: state.roles.filter((r) => r.id !== action.payload),
        // Also remove access entries and reassign peers
        accessMatrix: state.accessMatrix.filter((e) => e.roleId !== action.payload),
        peers: state.peers.map((p) =>
          p.roleId === action.payload ? { ...p, roleId: state.roles[0]?.id ?? '' } : p
        ),
      };

    case 'SET_SERVICES':
      return { ...state, services: action.payload };

    case 'SET_ACCESS_MATRIX':
      return { ...state, accessMatrix: action.payload };

    case 'TOGGLE_ACCESS': {
      const { roleId, serviceId } = action.payload;
      const exists = state.accessMatrix.some(
        (e) => e.roleId === roleId && e.serviceId === serviceId
      );
      const newMatrix = exists
        ? state.accessMatrix.filter((e) => !(e.roleId === roleId && e.serviceId === serviceId))
        : [...state.accessMatrix, { roleId, serviceId }];
      return { ...state, accessMatrix: newMatrix };
    }

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };

    default:
      return state;
  }
}

/* ── Initial state loader ── */
function loadInitialState(): AppState {
  return {
    peers: storageService.get<IPeer[]>('peers') ?? MOCK_PEERS,
    roles: storageService.get<IRole[]>('roles') ?? MOCK_ROLES,
    services: storageService.get<IService[]>('services') ?? MOCK_SERVICES,
    accessMatrix: storageService.get<IAccessEntry[]>('access-matrix') ?? MOCK_ACCESS_MATRIX,
    searchQuery: '',
  };
}

/* ── Context ── */
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | null>(null);

/* ── Provider ── */
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadInitialState);

  // Sync to localStorage on every state change
  useEffect(() => {
    storageService.set('peers', state.peers);
    storageService.set('roles', state.roles);
    storageService.set('services', state.services);
    storageService.set('access-matrix', state.accessMatrix);
  }, [state.peers, state.roles, state.services, state.accessMatrix]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

/* ── Hook ── */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
