import type { IDnsRecord, NewDnsRecordDTO, DnsSyncResult } from '../models';
import { storageService } from './storage.service';
import { MOCK_DNS_RECORDS } from '../data/mockData';

const KEY = 'dns_records';

function getAll(): IDnsRecord[] {
  return storageService.get<IDnsRecord[]>(KEY) ?? MOCK_DNS_RECORDS;
}

function getById(id: string): IDnsRecord | undefined {
  return getAll().find((r) => r.id === id);
}

function create(dto: NewDnsRecordDTO): IDnsRecord {
  const records = getAll();
  const newRecord: IDnsRecord = {
    ...dto,
    id: `dns-${Date.now()}`,
    createdAt: Date.now(),
    adguardSynced: true, // Mock sync success
  };
  const updated = [...records, newRecord];
  storageService.set(KEY, updated);
  return newRecord;
}

function update(id: string, dto: NewDnsRecordDTO): IDnsRecord | undefined {
  const records = getAll();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return undefined;
  
  records[idx] = { 
    ...records[idx], 
    ...dto,
    adguardSynced: true // Mock sync success on update
  };
  storageService.set(KEY, records);
  return records[idx];
}

function remove(id: string): void {
  const records = getAll().filter((r) => r.id !== id);
  storageService.set(KEY, records);
}

async function syncAll(): Promise<DnsSyncResult> {
  const records = getAll();
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const updatedRecords = records.map(r => ({ ...r, adguardSynced: true }));
  storageService.set(KEY, updatedRecords);
  
  return {
    ok: true,
    synced: records.length,
    failed: 0,
    total: records.length,
  };
}

export const dnsService = {
  getAll,
  getById,
  create,
  update,
  remove,
  syncAll,
};
