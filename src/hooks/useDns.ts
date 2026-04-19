import { useState, useEffect, useCallback } from 'react';
import { dnsService } from '../services';
import type { IDnsRecord, NewDnsRecordDTO } from '../models';

export function useDns() {
  const [records, setRecords] = useState<IDnsRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadRecords = useCallback(() => {
    setRecords(dnsService.getAll());
  }, []);

  useEffect(() => {
    loadRecords();
    const interval = setInterval(loadRecords, 5000);
    return () => clearInterval(interval);
  }, [loadRecords]);

  const addRecord = (dto: NewDnsRecordDTO) => {
    dnsService.create(dto);
    loadRecords();
  };

  const updateRecord = (id: string, dto: NewDnsRecordDTO) => {
    dnsService.update(id, dto);
    loadRecords();
  };

  const removeRecord = (id: string) => {
    dnsService.remove(id);
    loadRecords();
  };

  const syncAll = async () => {
    setIsSyncing(true);
    try {
      const result = await dnsService.syncAll();
      loadRecords();
      return result;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    records,
    isSyncing,
    addRecord,
    updateRecord,
    removeRecord,
    syncAll,
    refresh: loadRecords,
  };
}
