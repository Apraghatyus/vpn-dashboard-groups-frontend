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
}

export interface NewPeerDTO {
  displayName: string;
  username: string;
  ip: string;
  roleId: string;
}
