import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { IRole, NewRoleDTO } from '../models';
import { apiFetch } from '../lib/api';

export function useRoles() {
  const { state, dispatch } = useAppContext();

  const addRole = useCallback(async (dto: NewRoleDTO): Promise<void> => {
    const role = await apiFetch<IRole>('/api/roles', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    dispatch({ type: 'ADD_ROLE_RESPONSE', payload: role });
  }, [dispatch]);

  const removeRole = useCallback(async (roleId: string): Promise<void> => {
    await apiFetch<unknown>(`/api/roles/${roleId}`, { method: 'DELETE' });
    dispatch({ type: 'REMOVE_ROLE', payload: roleId });
  }, [dispatch]);

  const getRoleColor = useCallback(
    (roleId: string) => state.roles.find((r) => r.id === roleId)?.color ?? '#a8a29e',
    [state.roles]
  );

  const getRoleById = useCallback(
    (roleId: string) => state.roles.find((r) => r.id === roleId),
    [state.roles]
  );

  const filteredRoles = useMemo(() => {
    if (!state.searchQuery) return state.roles;
    const q = state.searchQuery.toLowerCase();
    return state.roles.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [state.roles, state.searchQuery]);

  return {
    roles: state.roles,
    filteredRoles,
    addRole,
    removeRole,
    getRoleColor,
    getRoleById,
  };
}
