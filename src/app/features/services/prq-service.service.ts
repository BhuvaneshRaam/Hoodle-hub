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

  // GET all requests
  getAllRequests() {
    return this.httpService.get<any[]>(this.PRQ + '/all');
  }

  // POST new request
  createRequest(data: any) {
    return this.httpService.post(this.PRQ + '/create', data);
  }

  // PUT (Approve) request
  approveRequest(id: string) {
    return this.httpService.put(`${this.PRQ}/${id}/approve`, {});
  }
}
