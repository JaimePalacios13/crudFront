import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formaPago } from '../models/formaPago';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {

  private apiUrl = 'http://localhost:8080/api/formaPago';

  constructor(private http: HttpClient) {}

  getFormaPago(): Observable<formaPago[]> {
    return this.http.get<formaPago[]>(`${this.apiUrl}`);
  }
}
