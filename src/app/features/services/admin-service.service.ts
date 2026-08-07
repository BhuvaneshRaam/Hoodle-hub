import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpServiceService } from '../../core/services/http-service.service';
import { UserRequest } from '../admin/models/user-request.model';
import { RoleRequest } from '../admin/models/role-request.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private authUrl = environment.authUrl + '/hoodle/api/v1';

  private USER = this.authUrl + '/user';
  private ROLE = this.authUrl + '/role';
  private PERMISSIONS = this.authUrl + '/permissions';

  constructor(private httpService: HttpServiceService) { }

  // getAllTenantUsers() {
  //   return this.httpService.get<any>(this.USER + '/all');
  // }

  getAllTenantUsers(page: number, size: number, search: string) {
    return this.httpService.get<any>(this.USER + '/all', { page, size, search });
  }

  createUser(request: UserRequest){
    return this.httpService.post(this.USER ,request);
  }


  updateUser(userId: string, request: UserRequest) {
    return this.httpService.post (`${this.USER}/${userId}`, request);
  }

  getAllTenantRolesList() {
    return this.httpService.get<any>(this.ROLE + '/list');
  }

  getAllTenantRoles(page: number, size: number, search: string) {
    return this.httpService.get<any>(this.ROLE + '/all', { page, size, search });
  }

  createRole(request: RoleRequest) {
    return this.httpService.post(this.ROLE ,request);
  }

  updateRole(roleId: string, request: UserRequest) {
    return this.httpService.post (`${this.ROLE}/${roleId}`, request);
  }

  getPermissionMatrix() {
    return this.httpService.get<any>(this.PERMISSIONS);
  }

}
