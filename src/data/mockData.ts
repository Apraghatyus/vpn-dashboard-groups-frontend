import type { IPeer, IRole, IService, IAccessEntry } from '../models';

export const MOCK_ROLES: IRole[] = [
  {
    id: 'admin',
    displayName: 'admin',
    description: 'Acceso total a toda la infraestructura',
    color: '#ef4444',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'familia',
    displayName: 'familia',
    description: 'Media, archivos y DNS',
    color: '#3b82f6',
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'gaming',
    displayName: 'gaming',
    description: 'Servidores de juegos',
    color: '#f59e0b',
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'cliente_aguaquim',
    displayName: 'cliente_aguaquim',
    description: 'Solo acceso al CRM corporativo',
    color: '#14b8a6',
    createdAt: Date.now() - 86400000 * 10,
  },
];

export const MOCK_PEERS: IPeer[] = [
  {
    id: 'peer-1',
    displayName: 'Juan Camilo · Owner',
    username: 'apraghato',
    ip: '10.8.0.2',
    roleId: 'admin',
    status: 'online',
    lastSeen: 'ahora',
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'peer-2',
    displayName: 'Camila · iPhone',
    username: 'camila_phone',
    ip: '10.8.0.3',
    roleId: 'familia',
    status: 'online',
    lastSeen: '2 min',
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: 'peer-3',
    displayName: 'Papá · Smart TV',
    username: 'papa_tv',
    ip: '10.8.0.4',
    roleId: 'familia',
    status: 'offline',
    lastSeen: '3h',
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: 'peer-4',
    displayName: 'Santi · Gaming rig',
    username: 'santi_pc',
    ip: '10.8.0.5',
    roleId: 'gaming',
    status: 'online',
    lastSeen: 'ahora',
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: 'peer-5',
    displayName: 'Operador 1 · Aguaquim',
    username: 'aguaquim_op1',
    ip: '10.8.0.6',
    roleId: 'cliente_aguaquim',
    status: 'offline',
    lastSeen: '1d',
    createdAt: Date.now() - 86400000 * 5,
  },
];

export const MOCK_SERVICES: IService[] = [
  { id: 'jellyfin', name: 'Jellyfin', endpoint: '100.75.203.14:8096', category: 'Media' },
  { id: 'navidrome', name: 'Navidrome', endpoint: '100.75.203.14:4533', category: 'Media' },
  { id: 'filebrowser', name: 'FileBrowser', endpoint: '100.75.203.14:8080', category: 'Herramientas' },
  { id: 'kavita', name: 'Kavita', endpoint: '100.75.203.14:5000', category: 'Media' },
  { id: 'minecraft-java', name: 'Minecraft Java', endpoint: '100.75.203.14:25565', category: 'Gaming' },
  { id: 'mc-bedrock', name: 'MC Bedrock', endpoint: '100.75.203.14:19132', category: 'Gaming' },
  { id: 'terraria', name: 'Terraria', endpoint: '100.75.203.14:7777', category: 'Gaming' },
  { id: 'aguaquim-crm', name: 'Aguaquim CRM', endpoint: '100.75.203.14:5433', category: 'CRM' },
  { id: 'portainer', name: 'Portainer', endpoint: '100.75.203.14:9443', category: 'Infraestructura' },
  { id: 'dns-pihole', name: 'DNS (Pi-hole)', endpoint: '100.114.140.34:53', category: 'Red' },
];

// Admin has access to ALL services
// familia: media + herramientas + DNS
// gaming: gaming services
// cliente_aguaquim: CRM + Portainer
export const MOCK_ACCESS_MATRIX: IAccessEntry[] = [
  // admin → everything
  ...MOCK_SERVICES.map((s) => ({ roleId: 'admin', serviceId: s.id })),

  // familia
  { roleId: 'familia', serviceId: 'jellyfin' },
  { roleId: 'familia', serviceId: 'navidrome' },
  { roleId: 'familia', serviceId: 'filebrowser' },
  { roleId: 'familia', serviceId: 'kavita' },
  { roleId: 'familia', serviceId: 'dns-pihole' },
  { roleId: 'familia', serviceId: 'minecraft-java' },

  // gaming
  { roleId: 'gaming', serviceId: 'minecraft-java' },
  { roleId: 'gaming', serviceId: 'mc-bedrock' },
  { roleId: 'gaming', serviceId: 'terraria' },
  { roleId: 'gaming', serviceId: 'jellyfin' },

  // cliente_aguaquim
  { roleId: 'cliente_aguaquim', serviceId: 'aguaquim-crm' },
  { roleId: 'cliente_aguaquim', serviceId: 'portainer' },
];
