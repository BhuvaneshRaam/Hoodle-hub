import { Role } from "./role.model";

export interface User {
  userId: string;
  userName: string;
  emailId: string;
  isActive: boolean;
  roles: Role[];
}