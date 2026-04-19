import { useState, useEffect, useCallback } from 'react';
import type { IVpnUser, IVpnUserWithDevices, NewVpnUserDTO, UpdateVpnUserDTO } from '../models';
import { apiFetch } from '../lib/api';

export function useVpnUsers() {
  const [users, setUsers] = useState<IVpnUser[]>([]);

  const loadUsers = useCallback(async () => {
    try {
      const data = await apiFetch<IVpnUser[]>('/api/vpn-users');
      setUsers(data);
    } catch (err) {
      console.error('Error cargando VPN users:', err);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const addUser = useCallback(async (dto: NewVpnUserDTO): Promise<void> => {
    await apiFetch<IVpnUser>('/api/vpn-users', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    await loadUsers();
  }, [loadUsers]);

  const updateUser = useCallback(async (id: string, dto: UpdateVpnUserDTO): Promise<void> => {
    await apiFetch<IVpnUser>(`/api/vpn-users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    await loadUsers();
  }, [loadUsers]);

  const removeUser = useCallback(async (id: string, cascade = false): Promise<void> => {
    await apiFetch<unknown>(`/api/vpn-users/${id}?cascade=${cascade}`, { method: 'DELETE' });
    await loadUsers();
  }, [loadUsers]);

  const getUserDetails = useCallback(async (id: string): Promise<IVpnUserWithDevices> => {
    return apiFetch<IVpnUserWithDevices>(`/api/vpn-users/${id}`);
  }, []);

  return {
    users,
    addUser,
    updateUser,
    removeUser,
    getUserDetails,
    refresh: loadUsers,
  };
}
