import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Solicitudes } from '../models/solicitudes';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private apiUrl = 'http://localhost:8080/api/solicitud';

  constructor(private http: HttpClient) {}

  getSolicitudes(clientId: number): Observable<Solicitudes[]> {
    return this.http.get<Solicitudes[]>(`${this.apiUrl}/cliente/${clientId}`);
  }

  save(Solicitudes: Solicitudes): Observable<Solicitudes> {
    console.log("Datos de la Solicitud a guardar:", Solicitudes);
    return this.http.post<Solicitudes>(this.apiUrl, Solicitudes).pipe(
      catchError(error => {
        console.log("Error al guardar la Solicitud: ", error);
        return throwError(() => new Error('Error al guardar Solicitud'));
      })
    );
  }

  update(Solicitudes: Solicitudes): Observable<Solicitudes> { 
    const url = `${this.apiUrl}/${Solicitudes.id}`;
    return this.http.put<Solicitudes>(url, Solicitudes).pipe(
      catchError(error => {
        console.log("Error al actualizar la sol: ", error);
        return throwError(() => new Error('Error al actualizar la sol'));
      })
    );
  }

  eliminar(idSolicitud: number): Observable<void> {
    const url = `${this.apiUrl}/${idSolicitud}`;
    return this.http.delete<void>(url).pipe(
      catchError(error => {
        console.log("Error al eliminar la solcitud: ", error);
        return throwError(() => new Error('Error al eliminar la solicitud'));
      })
    );
  }
}
