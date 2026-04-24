import { useCallback, useEffect, useState } from 'react';
import type { IDnsRecord, NewDnsRecordDTO } from '../models';
import { apiFetch } from '../lib/api';

interface UpdateDnsRecordDTO {
  domain?: string;
  answer?: string;
  type?: string;
  description?: string;
  serviceId?: string;
}

interface SyncResult {
  synced: number;
  errors: string[];
}

export function useDns() {
  const [records, setRecords] = useState<IDnsRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecords = useCallback(async (): Promise<void> => {
    try {
      const data = await apiFetch<IDnsRecord[]>('/api/dns');
      setRecords(data);
    } catch (err) {
      console.error('Error cargando DNS records:', err);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const addRecord = useCallback(async (dto: NewDnsRecordDTO): Promise<void> => {
    await apiFetch<IDnsRecord>('/api/dns', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    await loadRecords();
  }, [loadRecords]);

  const updateRecord = useCallback(
    async (id: string, dto: UpdateDnsRecordDTO): Promise<void> => {
      await apiFetch<IDnsRecord>(`/api/dns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dto),
      });
      await loadRecords();
    },
    [loadRecords],
  );

  const removeRecord = useCallback(
    async (id: string): Promise<void> => {
      await apiFetch<unknown>(`/api/dns/${id}`, { method: 'DELETE' });
      await loadRecords();
    },
    [loadRecords],
  );

  const syncAll = useCallback(async (): Promise<SyncResult> => {
    setLoading(true);
    try {
      return await apiFetch<SyncResult>('/api/dns/sync', { method: 'POST' });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    records,
    loading,
    addRecord,
    updateRecord,
    removeRecord,
    syncAll,
    refresh: loadRecords,
  };
}