import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

export function useSearch() {
  const { state, dispatch } = useAppContext();

  const setSearch = useCallback(
    (query: string) => dispatch({ type: 'SET_SEARCH', payload: query }),
    [dispatch]
  );

  return {
    searchQuery: state.searchQuery,
    setSearch,
  };
}
