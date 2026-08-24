import { Injectable } from '@angular/core';
import { HttpServiceService } from '../../core/services/http-service.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrqServiceService {

  constructor(private httpService: HttpServiceService) { }

  private orbitUrl = environment.orbitUrl + '/orbitorder/api/v1';
  private PRQ = this.orbitUrl + '/prq';

  getUserRequests(page: number, size: number) {
    return this.httpService.get<any>(this.PRQ , { page, size});
  }

  // GET all requests
  getAllRequests(page: number, size: number) {
    return this.httpService.get<any>(this.PRQ + '/all', { page, size });
  }

  getRequestById(uuid: string) {
    return this.httpService.get<any>(`${this.PRQ}/${uuid}`);
  }

  // POST new request
  createRequest(data: any) {
    return this.httpService.post(this.PRQ + '/create', data);
  }

  // POST (Approve) request
  approveRequest(uuid: string) {
    return this.httpService.post(`${this.PRQ}/${uuid}/approve`, {});
  }

  // PUT (update) request
  updateRequest(uuid: string, data: any) {
    return this.httpService.put(`${this.PRQ}/edit/${uuid}`, data);
  }

  // POST (Submit) request
  submitRequest(uuid: string) {
    return this.httpService.post(`${this.PRQ}/${uuid}/submit`, {});
  }
}
