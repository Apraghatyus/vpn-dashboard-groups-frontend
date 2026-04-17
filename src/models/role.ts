export interface IRole {
  id: string;
  displayName: string;
  description: string;
  color: string;
  createdAt: number;
}

export interface NewRoleDTO {
  id: string;
  displayName: string;
  description: string;
  color: string;
}
