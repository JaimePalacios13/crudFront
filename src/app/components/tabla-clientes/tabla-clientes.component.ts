import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { clientes } from '../../models/clientes';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabla-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-clientes.component.html',
  styleUrls: ['./tabla-clientes.component.css']
})
export class TablaClientesComponent implements OnInit {
  clientes: clientes[] = [];
  clienteSeleccionado: any;

  constructor(private clientesService: ClientesService,private router: Router) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clientesService.findAll().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrió un error al cargar los clientes."
        });
      }
    });
  }

  editCliente(cliente: clientes): void {
    this.clientesService.cambiarCliente(cliente);
  }
  verSolicitud(clienteId: any) {
    const idCliente = clienteId;
    this.router.navigate([`/solicitud/cliente`, idCliente]);
  }

  deleteCliente(clienteId: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
  
    swalWithBootstrapButtons.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminarlo",
      cancelButtonText: "No, cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.eliminar(clienteId).subscribe({
          next: () => {
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'El cliente ha sido eliminado exitosamente.',
              'success'
            );
            this.loadClientes();
          },
          error: (error) => {
            console.error('Error al eliminar cliente:', error);
            swalWithBootstrapButtons.fire(
              'Error',
              'No se pudo eliminar el cliente. Intenta nuevamente.',
              'error'
            );
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El cliente está a salvo :)',
          'error'
        );
      }
    });
  }  
}
