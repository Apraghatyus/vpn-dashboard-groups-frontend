export type DnsRecordType = 'A' | 'CNAME';

export interface IDnsRecord {
  id: string;
  domain: string;
  answer: string;
  type: DnsRecordType;
  description: string;
  serviceId?: string;
  createdAt: number;
  adguardSynced?: boolean;
}

export interface NewDnsRecordDTO {
  domain: string;
  answer: string;
  type: DnsRecordType;
  description: string;
  serviceId?: string;
}

export interface DnsSyncResult {
  ok: boolean;
  synced: number;
  failed: number;
  total: number;
}
