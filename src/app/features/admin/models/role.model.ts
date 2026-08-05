import { Permission } from "./permission.model";

export interface Role {
  id: number;
  roleName: string;
  active: boolean;
  permissions: Permission[]; 
  description?: string;
}