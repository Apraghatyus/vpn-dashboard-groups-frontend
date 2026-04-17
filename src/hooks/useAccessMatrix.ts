import { useCallback, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { IAccessEntry } from '../models';
import { apiFetch } from '../lib/api';

export function useAccessMatrix() {
  const { state, dispatch } = useAppContext();

  const hasAccess = useCallback(
    (roleId: string, serviceId: string) =>
      state.accessMatrix.some(
        (e) => e.roleId === roleId && e.serviceId === serviceId
      ),
    [state.accessMatrix]
  );

  const toggleAccess = useCallback(
    async (roleId: string, serviceId: string): Promise<void> => {
      const matrix = await apiFetch<IAccessEntry[]>('/api/access/toggle', {
        method: 'POST',
        body: JSON.stringify({ roleId, serviceId }),
      });
      dispatch({ type: 'SET_ACCESS_MATRIX', payload: matrix });
    },
    [dispatch]
  );

  const getServicesForRole = useCallback(
    (roleId: string) => {
      const serviceIds = state.accessMatrix
        .filter((e) => e.roleId === roleId)
        .map((e) => e.serviceId);
      return state.services.filter((s) => serviceIds.includes(s.id));
    },
    [state.accessMatrix, state.services]
  );

  const getRuleCount = useCallback(
    (roleId: string) => state.accessMatrix.filter((e) => e.roleId === roleId).length,
    [state.accessMatrix]
  );

  const getRuleCountDisplay = useCallback(
    (roleId: string) => {
      const count = getRuleCount(roleId);
      if (count === state.services.length) return '∞ reglas';
      return `${count} reglas`;
    },
    [getRuleCount, state.services.length]
  );

  const matrix = useMemo(() => state.accessMatrix, [state.accessMatrix]);

  return {
    matrix,
    hasAccess,
    toggleAccess,
    getServicesForRole,
    getRuleCount,
    getRuleCountDisplay,
  };
}
