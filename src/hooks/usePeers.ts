import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { NewPeerDTO } from '../models';

export function usePeers() {
  const { state, dispatch } = useAppContext();

  const addPeer = useCallback(
    (dto: NewPeerDTO) => dispatch({ type: 'ADD_PEER', payload: dto }),
    [dispatch]
  );

  const removePeer = useCallback(
    (peerId: string) => dispatch({ type: 'REMOVE_PEER', payload: peerId }),
    [dispatch]
  );

  const updatePeerRole = useCallback(
    (peerId: string, roleId: string) =>
      dispatch({ type: 'UPDATE_PEER_ROLE', payload: { peerId, roleId } }),
    [dispatch]
  );

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
