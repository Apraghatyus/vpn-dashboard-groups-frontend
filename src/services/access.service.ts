import type { IAccessEntry, IService } from '../models';
import { storageService } from './storage.service';
import { serviceService } from './service.service';
import { MOCK_ACCESS_MATRIX } from '../data/mockData';

const KEY = 'access-matrix';

function getMatrix(): IAccessEntry[] {
  return storageService.get<IAccessEntry[]>(KEY) ?? MOCK_ACCESS_MATRIX;
}

function hasAccess(roleId: string, serviceId: string): boolean {
  return getMatrix().some(
    (e) => e.roleId === roleId && e.serviceId === serviceId
  );
}

function toggleAccess(roleId: string, serviceId: string): IAccessEntry[] {
  let matrix = getMatrix();
  const exists = matrix.some(
    (e) => e.roleId === roleId && e.serviceId === serviceId
  );

  if (exists) {
    matrix = matrix.filter(
      (e) => !(e.roleId === roleId && e.serviceId === serviceId)
    );
  } else {
    matrix = [...matrix, { roleId, serviceId }];
  }

  storageService.set(KEY, matrix);
  return matrix;
}

function getServicesForRole(roleId: string): IService[] {
  const matrix = getMatrix();
  const serviceIds = matrix
    .filter((e) => e.roleId === roleId)
    .map((e) => e.serviceId);
  return serviceService
    .getAll()
    .filter((s) => serviceIds.includes(s.id));
}

function getRuleCount(roleId: string): number {
  return getMatrix().filter((e) => e.roleId === roleId).length;
}

function getRuleCountDisplay(roleId: string): string {
  const count = getRuleCount(roleId);
  const total = serviceService.count();
  if (count === total) return '∞ reglas';
  return `${count} reglas`;
}

export const accessService = {
  getMatrix,
  hasAccess,
  toggleAccess,
  getServicesForRole,
  getRuleCount,
  getRuleCountDisplay,
};
