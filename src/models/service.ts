export type ServiceCategory =
  | 'Media'
  | 'Gaming'
  | 'CRM'
  | 'Infraestructura'
  | 'Herramientas'
  | 'Red';

export interface IService {
  id: string;
  name: string;
  endpoint: string;
  category: ServiceCategory;
}

export const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  Media: '#f59e0b',
  Gaming: '#3b82f6',
  CRM: '#ef4444',
  Infraestructura: '#a855f7',
  Herramientas: '#14b8a6',
  Red: '#ef4444',
};
