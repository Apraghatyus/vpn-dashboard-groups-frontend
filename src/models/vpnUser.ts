import type { IPeer } from './peer';

export interface IVpnUser {
  id: string;
  displayName: string;
  email: string;
  roleId: string;
  createdAt: number;
}

export interface IVpnUserWithDevices extends IVpnUser {
  devices: IPeer[];
}

export interface NewVpnUserDTO {
  displayName: string;
  email: string;
  roleId: string;
}
