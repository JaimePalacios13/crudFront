import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Solicitudes } from '../../models/solicitudes';
import { SolicitudesService } from '../../services/solicitudes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormaPagoService } from '../../services/forma-pago.service';
import { formaPago } from '../../models/formaPago';
import { log } from 'console';
import { clientes } from '../../models/clientes';

@Component({
  selector: 'app-listado-solicitudes',
  standalone: true,
  templateUrl: './listado-solicitudes.component.html',
  styleUrls: ['./listado-solicitudes.component.css'],
  imports: [
    CommonModule, FormsModule
  ]
})
export class ListadoSolicitudesComponent implements OnInit {
  solicitudes: Solicitudes[] = [];
  formaPago: formaPago[] = [];
  idCliente: number | null = null;
  nuevaSolicitud: Solicitudes = new Solicitudes();
  isLoading: boolean = false;

  constructor(
    private solicitudesService: SolicitudesService,
    private route: ActivatedRoute,
    private router: Router,
    private formaPagoService: FormaPagoService
  ) { }

  ngOnInit() {
    this.startLoading();
    this.nuevaSolicitud.formasDePago.id = 0;
    this.idCliente = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idCliente) {
      this.cargarSolicitudes(this.idCliente);
    }

    this.cargarFormaPago();
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  startLoading() {
    this.isLoading = true;
  }
  cargarSolicitudes(idCliente: number) {
    this.solicitudesService.getSolicitudes(idCliente).subscribe({
      next: (data) => {
        console.log(data);
        this.solicitudes = data;
        console.log("solicitudes:: ", this.solicitudes);
      },
      error: (error) => {
        console.error('Error al cargar las solicitudes:', error);
      }
    });
  }

  cargarFormaPago() {
    this.formaPagoService.getFormaPago().subscribe({
      next: (data) => {
        this.formaPago = data;
        console.log("formaPago:: ", this.formaPago);
      },
      error: (error) => {
        console.error('Error al cargar las formaPago:', error);
      }
    });
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
        // Aquí es donde se llama al servicio para eliminar el cliente
        this.solicitudesService.eliminar(clienteId).subscribe({
          next: () => {
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'Solicitud eliminada correctamente.',
              'success'
            );
            if (this.idCliente !== null && !isNaN(this.idCliente)) {
              this.cargarSolicitudes(this.idCliente);
            }
          },
          error: (error) => {
            console.error('Error al eliminar la solicitud:', error);
            swalWithBootstrapButtons.fire(
              'Error',
              'No se pudo eliminar la solicitud. Intenta nuevamente.',
              'error'
            );
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La solicitud está a salvo :)',
          'error'
        );
      }
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      if (this.nuevaSolicitud.formasDePago.id === 0) {        
        this.mostrarAlerta('error', 'La forma de pago es requerida.');
        return;
      }
      if (this.nuevaSolicitud.id && this.nuevaSolicitud.id != 0) {
        if (this.idCliente !== null && !isNaN(this.idCliente)) {
          if (!this.nuevaSolicitud.persona) {
            this.nuevaSolicitud.persona = new clientes();
          }
          this.nuevaSolicitud.persona.id = this.idCliente;
        }
        
        this.solicitudesService.update(this.nuevaSolicitud).subscribe({
          next: (solActualizado) => {
            this.mostrarAlerta('success', 'Se actualizo la solicitud con éxito');
            if (this.idCliente !== null && !isNaN(this.idCliente)) {
              this.cargarSolicitudes(this.idCliente);
            }
            form.reset();
          },
          error: (error) => {
            console.error('Error al actualizar solicitud:', error);
            this.alertaFormSolicitud("Ocurrió un error al actualizar la solicitud.");
          }
        });
      } else {
        if (this.idCliente !== null && !isNaN(this.idCliente)) {
          this.nuevaSolicitud.persona.id = this.idCliente;
        }
        this.solicitudesService.save(this.nuevaSolicitud).subscribe({
          next: (nuevaSol) => {
            this.mostrarAlerta('success', 'Se guardó la solicitud con éxito');
            if (this.idCliente !== null && !isNaN(this.idCliente)) {
              this.cargarSolicitudes(this.idCliente);
            }
            form.reset();
          },
          error: (error) => {
            console.error('Error al guardar cliente:', error);
            this.alertaFormSolicitud("Ocurrió un error al guardar la solicitud.");
          }
        });
      }
    }
  }

  editarSolicitud(solicitud: Solicitudes) {
    this.nuevaSolicitud = { ...solicitud };
  }

  regresar() {
    this.router.navigate(['/principal']);
  }

  alertaFormSolicitud(texto: string) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: texto,
    });
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

  soloNumeros(event: KeyboardEvent) {
    const pattern = /[0-9.]/;
    const inputChar = String.fromCharCode(event.charCode);

    // Permite solo números y un solo punto decimal
    if (!pattern.test(inputChar) || (inputChar === '.' && this.nuevaSolicitud.monto.includes('.'))) {
        event.preventDefault();
    }
}

}
