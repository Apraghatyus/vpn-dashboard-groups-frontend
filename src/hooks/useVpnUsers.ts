import { useState, useEffect, useCallback } from 'react';
import { vpnUserService } from '../services';
import type { IVpnUser, IVpnUserWithDevices, NewVpnUserDTO, IPeer } from '../models';

export function useVpnUsers() {
  const [users, setUsers] = useState<IVpnUser[]>([]);

  const loadUsers = useCallback(() => {
    setUsers(vpnUserService.getAll());
  }, []);

  useEffect(() => {
    loadUsers();
    // In a real app we might poll or use websockets
    const interval = setInterval(loadUsers, 5000);
    return () => clearInterval(interval);
  }, [loadUsers]);

  const addUser = (dto: NewVpnUserDTO) => {
    try {
      vpnUserService.create(dto);
      loadUsers();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateUser = (id: string, data: Partial<NewVpnUserDTO>) => {
    try {
      vpnUserService.update(id, data);
      loadUsers();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const removeUser = (id: string) => {
    vpnUserService.remove(id);
    loadUsers();
  };

  const getUserDetails = (id: string): IVpnUserWithDevices | undefined => {
    return vpnUserService.getById(id);
  };

  const getUserDevices = (id: string): IPeer[] => {
    return vpnUserService.getDevicesByUser(id);
  };

  return {
    users,
    addUser,
    updateUser,
    removeUser,
    getUserDetails,
    getUserDevices,
    refresh: loadUsers,
  };
}
