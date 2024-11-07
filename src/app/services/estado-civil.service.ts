import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { estadoCivil } from '../models/estadoCivil';

@Injectable({
  providedIn: 'root'
})
export class EstadoCivilService {

  private apiUrl = 'http://localhost:8080/api/estadoCivil';
  constructor(private http: HttpClient) { }

  findAll(): Observable<estadoCivil[]>{
    return this.http.get<estadoCivil[]>(this.apiUrl).pipe(
      catchError(error => {
        console.log("Error en la solicitud estadoCivil: ",error);
        return throwError(() => new Error('Error en la carga de estado civil'));
      })
    );
  }
}
