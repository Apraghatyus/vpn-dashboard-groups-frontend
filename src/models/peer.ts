export type PeerStatus = 'online' | 'offline';

export interface IPeer {
  id: string;
  displayName: string;
  username: string;
  ip: string;
  roleId: string;
  status: PeerStatus;
  lastSeen: string;
  createdAt: number;
  userId?: string;
  deviceName?: string;
}

export interface NewPeerDTO {
  displayName: string;
  username: string;
  ip: string;
  roleId: string;
  userId?: string;
  deviceName?: string;
}

export interface UpdatePeerDTO {
  displayName?: string;
  username?: string;
  ip?: string;
  roleId?: string;
  userId?: string | null;  // null = desvincula del usuario
  deviceName?: string;
}
