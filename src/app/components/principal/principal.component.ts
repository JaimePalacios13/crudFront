import { Component, ViewChild } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormularioClienteComponent } from '../formulario-cliente/formulario-cliente.component';
import { NgxMaskDirective } from 'ngx-mask';
import { TablaClientesComponent } from '../tabla-clientes/tabla-clientes.component';
import { ClientesService } from '../../services/clientes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [FormularioClienteComponent, NgxMaskDirective, TablaClientesComponent, CommonModule],
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
  isLoading: boolean = false;
  txtLoading: string = "Cargando Datos";

  @ViewChild('tablaClientes') tablaClientes!: TablaClientesComponent;

  constructor(private servicioCliente: ClientesService) {}

  ngOnInit() {
    this.startLoading();

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  onClienteGuardado(isSuccess: boolean): void {
    this.startLoading();
    if (isSuccess) {
      this.refreshTablaClientes();
    } else {
      this.mostrarAlerta('error', 'Error al procesar la solicitud del cliente, intenta nuevamente.');
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  editCliente(cliente: any): void {
    this.servicioCliente.cambiarCliente(cliente);
  }

  refreshTablaClientes(): void {
    if (this.tablaClientes) {
      this.tablaClientes.loadClientes();
    }
  }

  startLoading() {
    this.isLoading = true;
  }

  mostrarAlerta(icon: SweetAlertIcon, title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: icon,
      title: title
    });
  }
}
