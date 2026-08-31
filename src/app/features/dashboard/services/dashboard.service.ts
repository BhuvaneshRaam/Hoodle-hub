import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceService } from '../../../core/services/http-service.service';
import { DashboardSummaryModel } from '../models/dashboard-summary.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpService: HttpServiceService) {}

  private orbitUrl = environment.orbitUrl + '/orbitorder/api/v1';
  
  private DASHBOARD = this.orbitUrl + '/dashboard';

  /**
   * Retrieves the dashboard summary data.
   * @returns Observable of DashboardSummaryModel
   */
  getSummary(): Observable<DashboardSummaryModel> {
    return this.httpService.get<DashboardSummaryModel>(this.DASHBOARD + '/summary');
  }
}
