/**
 * StorageService — abstraction layer for data persistence.
 *
 * Currently uses localStorage.
 * When the Flask backend is ready, swap the implementation here
 * (localStorage → fetch) and NOTHING else changes.
 */

const STORAGE_PREFIX = 'wg-acl-';

class StorageService {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, data: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.error(`StorageService.set('${key}') failed:`, e);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }

  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  }
}

export const storageService = new StorageService();
