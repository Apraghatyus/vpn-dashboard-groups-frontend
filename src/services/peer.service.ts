import type { IPeer, NewPeerDTO } from '../models';
import { storageService } from './storage.service';
import { MOCK_PEERS } from '../data/mockData';

const KEY = 'peers';

function getAll(): IPeer[] {
  return storageService.get<IPeer[]>(KEY) ?? MOCK_PEERS;
}

function getById(id: string): IPeer | undefined {
  return getAll().find((p) => p.id === id);
}

function create(dto: NewPeerDTO): IPeer {
  const peers = getAll();
  const newPeer: IPeer = {
    ...dto,
    id: `peer-${Date.now()}`,
    status: 'offline',
    lastSeen: 'ahora',
    createdAt: Date.now(),
  };
  const updated = [...peers, newPeer];
  storageService.set(KEY, updated);
  return newPeer;
}

function updateRole(peerId: string, roleId: string): IPeer | undefined {
  const peers = getAll();
  const idx = peers.findIndex((p) => p.id === peerId);
  if (idx === -1) return undefined;
  peers[idx] = { ...peers[idx], roleId };
  storageService.set(KEY, peers);
  return peers[idx];
}

function remove(peerId: string): void {
  const peers = getAll().filter((p) => p.id !== peerId);
  storageService.set(KEY, peers);
}

function getByRole(roleId: string): IPeer[] {
  return getAll().filter((p) => p.roleId === roleId);
}

function countOnline(): number {
  return getAll().filter((p) => p.status === 'online').length;
}

function count(): number {
  return getAll().length;
}

export const peerService = {
  getAll,
  getById,
  create,
  updateRole,
  remove,
  getByRole,
  countOnline,
  count,
};
