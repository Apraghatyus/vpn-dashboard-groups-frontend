import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { NewRoleDTO } from '../models';

export function useRoles() {
  const { state, dispatch } = useAppContext();

  const addRole = useCallback(
    (dto: NewRoleDTO) => dispatch({ type: 'ADD_ROLE', payload: dto }),
    [dispatch]
  );

  const removeRole = useCallback(
    (roleId: string) => dispatch({ type: 'REMOVE_ROLE', payload: roleId }),
    [dispatch]
  );

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
