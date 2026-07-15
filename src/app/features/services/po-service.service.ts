import { Injectable } from '@angular/core';
import { HttpServiceService } from '../../core/services/http-service.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PoServiceService {

  constructor(private httpService: HttpServiceService) { }

  private orbitUrl = environment.orbitUrl + '/orbitorder/api/v1';
  private PO = this.orbitUrl + '/po';

  // GET all orders
  getAllOrders(page: number = 0, size: number = 10) {
    return this.httpService.get<any>(this.PO + '/all', { page, size });
  }

  // GET order by ID
  getOrderById(uuid: String) {
    return this.httpService.get<any>(`${this.PO}/${uuid}`);
  }

  // PUT (update) order
  updateOrder(uuid: string, data: any) {
    return this.httpService.put(`${this.PO}/edit/${uuid}`, data);
  }

  // POST (generate) request
  submitRequest(uuid: string) {
    return this.httpService.post(`${this.PO}/submit/${uuid}`, {});
  }
}
