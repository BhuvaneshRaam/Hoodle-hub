import { Injectable } from '@angular/core';
import { HttpServiceService } from '../../core/services/http-service.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {

  constructor(private httpService: HttpServiceService) { }

  private orbitUrl = environment.orbitUrl + '/orbitorder/api/v1';

  private VENDOR = this.orbitUrl + '/vendor';

  // GET all vendors
  getAllVendors(page: number = 0, size: number = 10, search: string) {
    return this.httpService.get<any>(this.VENDOR + '/all', { page, size, search });
  }

  // GET vendor by ID
  getVendorById(uuid: string) {
    return this.httpService.get<any>(`${this.VENDOR}/${uuid}`);
  }

  // GET active vendors list
  getVendorList() {
    return this.httpService.get<any>(this.VENDOR + '/list');
  }

  // POST new vendor
  createVendor(request: any) {
    return this.httpService.post(this.VENDOR, request);
  }

  // POST update vendor
  updateVendor(uuid: string, request: any) {
    return this.httpService.post(`${this.VENDOR}/${uuid}`, request);
  }







}
