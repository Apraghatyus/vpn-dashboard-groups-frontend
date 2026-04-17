/**
 * Represents a single access entry in the matrix.
 * The full matrix is IAccessEntry[].
 *
 * To check if a role has access to a service:
 *   matrix.some(e => e.roleId === 'admin' && e.serviceId === 'jellyfin')
 */
export interface IAccessEntry {
  roleId: string;
  serviceId: string;
}
