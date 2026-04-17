import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { CATEGORY_COLORS, type ServiceCategory } from '../models';

export function useServices() {
  const { state } = useAppContext();

  const byCategory = useMemo(() => {
    const grouped = {} as Record<ServiceCategory, typeof state.services>;
    state.services.forEach((s) => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });
    return grouped;
  }, [state.services]);

  const categories = useMemo(
    () => Object.keys(byCategory) as ServiceCategory[],
    [byCategory]
  );

  const getCategoryColor = (cat: ServiceCategory) => CATEGORY_COLORS[cat];

  return {
    services: state.services,
    byCategory,
    categories,
    getCategoryColor,
    totalCount: state.services.length,
  };
}
