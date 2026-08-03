import { Permission } from "./permission.model";

export interface Role {
  id: number;
  name: string;
  active: boolean;
  permissions: Permission[]; 
  description?: string;
}