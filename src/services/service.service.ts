import type { IService, ServiceCategory } from '../models';
import { CATEGORY_COLORS } from '../models';
import { storageService } from './storage.service';
import { MOCK_SERVICES } from '../data/mockData';

const KEY = 'services';

function getAll(): IService[] {
  return storageService.get<IService[]>(KEY) ?? MOCK_SERVICES;
}

function getById(id: string): IService | undefined {
  return getAll().find((s) => s.id === id);
}

function getByCategory(): Record<ServiceCategory, IService[]> {
  const services = getAll();
  const grouped = {} as Record<ServiceCategory, IService[]>;
  services.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });
  return grouped;
}

function create(service: Omit<IService, 'id'>): IService {
  const services = getAll();
  const newService: IService = {
    ...service,
    id: service.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
  };
  const updated = [...services, newService];
  storageService.set(KEY, updated);
  return newService;
}

function count(): number {
  return getAll().length;
}

function getCategoryColor(cat: ServiceCategory): string {
  return CATEGORY_COLORS[cat];
}

function getCategories(): ServiceCategory[] {
  const cats = new Set(getAll().map((s) => s.category));
  return Array.from(cats);
}

export const serviceService = {
  getAll,
  getById,
  getByCategory,
  create,
  count,
  getCategoryColor,
  getCategories,
};
