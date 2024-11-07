import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { actividadEconomica } from '../models/actividadEconomica';

@Injectable({
  providedIn: 'root'
})
export class ActividadEconomicaService {

  private apiUrl = 'http://localhost:8080/api/actividadesEconomicas';

  constructor(private http: HttpClient) { }

  findAll(): Observable<actividadEconomica[]> {
    return this.http.get<actividadEconomica[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error en la solicitud:', error);
        return throwError(() => new Error('Error en la carga de actividades económicas'));
      })
    );
  }
}
