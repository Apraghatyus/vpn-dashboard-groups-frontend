import type { IVpnUser, IVpnUserWithDevices, NewVpnUserDTO, IPeer } from '../models';
import { storageService } from './storage.service';
import { MOCK_VPN_USERS } from '../data/mockData';
import { peerService } from './peer.service';

const KEY = 'vpn_users';

function getAll(): IVpnUser[] {
  return storageService.get<IVpnUser[]>(KEY) ?? MOCK_VPN_USERS;
}

function getById(id: string): IVpnUserWithDevices | undefined {
  const users = getAll();
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;
  
  const allPeers = peerService.getAll();
  const devices = allPeers.filter(p => p.userId === id);
  
  return {
    ...user,
    devices
  };
}

function create(dto: NewVpnUserDTO): IVpnUser {
  const users = getAll();
  
  // Check if email already exists
  if (users.some(u => u.email === dto.email)) {
    throw new Error('El correo electrónico ya está registrado');
  }

  const newUser: IVpnUser = {
    ...dto,
    id: `vpnuser-${Date.now()}`,
    createdAt: Date.now(),
  };
  
  const updated = [...users, newUser];
  storageService.set(KEY, updated);
  return newUser;
}

function update(id: string, data: Partial<NewVpnUserDTO>): IVpnUser | undefined {
  const users = getAll();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  
  if (data.email && data.email !== users[idx].email && users.some(u => u.email === data.email)) {
    throw new Error('El correo electrónico ya está registrado');
  }

  users[idx] = { ...users[idx], ...data };
  storageService.set(KEY, users);
  return users[idx];
}

function remove(id: string): void {
  const users = getAll().filter((u) => u.id !== id);
  storageService.set(KEY, users);
  
  // Release the devices
  const allPeers = peerService.getAll();
  const updatedPeers = allPeers.map(p => {
    if (p.userId === id) {
      const { userId, ...rest } = p;
      return rest as IPeer;
    }
    return p;
  });
  storageService.set('peers', updatedPeers);
}

function getDevicesByUser(id: string): IPeer[] {
  const allPeers = peerService.getAll();
  return allPeers.filter(p => p.userId === id);
}

export const vpnUserService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getDevicesByUser,
};
