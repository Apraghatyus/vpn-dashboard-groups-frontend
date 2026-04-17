import type { IRole, NewRoleDTO } from '../models';
import { storageService } from './storage.service';
import { MOCK_ROLES } from '../data/mockData';

const KEY = 'roles';

function getAll(): IRole[] {
  return storageService.get<IRole[]>(KEY) ?? MOCK_ROLES;
}

function getById(id: string): IRole | undefined {
  return getAll().find((r) => r.id === id);
}

function create(dto: NewRoleDTO): IRole {
  const roles = getAll();
  const newRole: IRole = {
    ...dto,
    createdAt: Date.now(),
  };
  const updated = [...roles, newRole];
  storageService.set(KEY, updated);
  return newRole;
}

function update(id: string, data: Partial<IRole>): IRole | undefined {
  const roles = getAll();
  const idx = roles.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  roles[idx] = { ...roles[idx], ...data };
  storageService.set(KEY, roles);
  return roles[idx];
}

function remove(id: string): void {
  const roles = getAll().filter((r) => r.id !== id);
  storageService.set(KEY, roles);
}

function getColor(roleId: string): string {
  return getById(roleId)?.color ?? '#a8a29e';
}

function count(): number {
  return getAll().length;
}

export const roleService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getColor,
  count,
};
