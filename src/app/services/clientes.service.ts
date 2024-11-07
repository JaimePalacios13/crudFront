import { Injectable } from '@angular/core';
import { clientes } from '../models/clientes';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = 'http://localhost:8080/api/cliente';

  clientes: clientes[] = [];

  constructor(private http: HttpClient) { }

  private clienteData = new BehaviorSubject<any>(null);
  clienteActual = this.clienteData.asObservable();

  cambiarCliente(cliente: any) {
    this.clienteData.next(cliente);
  }

  findAll(): Observable<clientes[]> {
    return this.http.get<clientes[]>(this.apiUrl).pipe(
      catchError(error => {
        console.log("Error en la solicitud clientes: ", error);
        return throwError(() => new Error('Error en la carga de estado civil'));
      })
    );
  }

  // Método para guardar un nuevo cliente
  save(cliente: clientes): Observable<clientes> {
    console.log("Datos del cliente a guardar:", cliente);
    cliente.dui = this.formatDui(cliente.dui);
    cliente.nit = this.formatNit(cliente.nit);
    return this.http.post<clientes>(this.apiUrl, cliente).pipe(
      catchError(error => {
        console.log("Error al guardar cliente: ", error);
        return throwError(() => new Error('Error al guardar cliente'));
      })
    );
  }

  update(cliente: clientes): Observable<clientes> {
    console.log("Datos del cliente a actualizar:", cliente);
    cliente.dui = this.formatDui(cliente.dui);
    cliente.nit = this.formatNit(cliente.nit);
    
    const url = `${this.apiUrl}/${cliente.id}`;
    return this.http.put<clientes>(url, cliente).pipe(
      catchError(error => {
        console.log("Error al actualizar cliente: ", error);
        return throwError(() => new Error('Error al actualizar cliente'));
      })
    );
  }
  
  

  eliminar(clienteId: number): Observable<void> {
    const url = `${this.apiUrl}/${clienteId}`;
    return this.http.delete<void>(url).pipe(
      catchError(error => {
        console.log("Error al eliminar cliente: ", error);
        return throwError(() => new Error('Error al eliminar cliente'));
      })
    );
  }

  formatDui(dui: string): string {
    if (!dui) return dui;
    const duiRegex = /^(\d{8})(\d)$/;
    const match = dui.match(duiRegex);

    if (match) {
      return `${match[1]}-${match[2]}`;
    }
    return dui;
  }

  formatNit(nit: string): string {
    if (!nit) return nit;
    const nitRegex = /^(\d{4})(\d{6})(\d{3})(\d)$/;
    const match = nit.match(nitRegex);

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}-${match[4]}`; 
    }
    return nit;
  }
}
