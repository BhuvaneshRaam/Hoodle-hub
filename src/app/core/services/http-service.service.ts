import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor() { }

  private readonly http = inject(HttpClient);
  
  private readonly baseUrl = environment.authUrl; 

  /**
   * GET request
   */
  public get<T>(endpoint: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint}`;

    return this.http.get<T>(url, { params: httpParams });
  }

  /**
   * POST request
   */
  public post<T>(endpoint: string, body: any): Observable<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint}`;
    return this.http.post<T>(url, body);
  }

  /**
   * PUT request
   */
  public put<T>(endpoint: string, body: any): Observable<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint}`;
    return this.http.put<T>(url, body);
  }

  /**
   * DELETE request
   */
  public delete<T>(endpoint: string): Observable<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint}`;
    return this.http.delete<T>(url);
  }
}
