import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { IPeer, NewPeerDTO } from '../models';
import { apiFetch } from '../lib/api';

export function usePeers() {
  const { state, dispatch } = useAppContext();

  const addPeer = useCallback(async (dto: NewPeerDTO): Promise<void> => {
    const peer = await apiFetch<IPeer>('/api/peers', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    dispatch({ type: 'ADD_PEER_RESPONSE', payload: peer });
  }, [dispatch]);

  const removePeer = useCallback(async (peerId: string): Promise<void> => {
    await apiFetch<unknown>(`/api/peers/${peerId}`, { method: 'DELETE' });
    dispatch({ type: 'REMOVE_PEER', payload: peerId });
  }, [dispatch]);

  const updatePeerRole = useCallback(async (peerId: string, roleId: string): Promise<void> => {
    // Optimistic update so the dropdown doesn't snap back
    dispatch({ type: 'UPDATE_PEER_ROLE', payload: { peerId, roleId } });
    await apiFetch<IPeer>(`/api/peers/${peerId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ roleId }),
    });
  }, [dispatch]);

  const onlineCount = useMemo(
    () => state.peers.filter((p) => p.status === 'online').length,
    [state.peers]
  );

  const filteredPeers = useMemo(() => {
    if (!state.searchQuery) return state.peers;
    const q = state.searchQuery.toLowerCase();
    return state.peers.filter(
      (p) =>
        p.displayName.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.ip.includes(q)
    );
  }, [state.peers, state.searchQuery]);

  return {
    peers: state.peers,
    filteredPeers,
    onlineCount,
    addPeer,
    removePeer,
    updatePeerRole,
  };
}
