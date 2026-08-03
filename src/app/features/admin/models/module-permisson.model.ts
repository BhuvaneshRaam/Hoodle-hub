import { Privilege } from "./privilege.model";

export interface ModulePermission {
  moduleName: string;
  availablePrivileges: Privilege[];
}