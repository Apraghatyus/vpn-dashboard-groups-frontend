import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { IPeer, NewPeerDTO, UpdatePeerDTO } from '../models';
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

  const updatePeer = useCallback(async (peerId: string, dto: UpdatePeerDTO): Promise<void> => {
    const peer = await apiFetch<IPeer>(`/api/peers/${peerId}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    dispatch({ type: 'UPDATE_PEER', payload: peer });
  }, [dispatch]);

  const downloadConfig = useCallback(async (peerId: string, username: string): Promise<void> => {
    const res = await fetch(`/api/peers/${peerId}/config`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('wg-acl-auth') ?? '{}')?.token ?? ''}`,
      },
    });
    const text = await res.text();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}.conf`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

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
    updatePeer,
    removePeer,
    updatePeerRole,
    downloadConfig,
  };
}
