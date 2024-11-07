import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { ActividadEconomicaService } from '../../services/actividad-economica.service';
import { ClientesService } from '../../services/clientes.service';
import { actividadEconomica } from '../../models/actividadEconomica';
import { estadoCivil } from '../../models/estadoCivil';
import { EstadoCivilService } from '../../services/estado-civil.service';
import { clientes } from '../../models/clientes';
import { ViewChild } from '@angular/core';

import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-formulario-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.css']
})
export class FormularioClienteComponent implements OnInit {
  actividadEconomica: actividadEconomica[] = [];
  estadoCivil: estadoCivil[] = [];
  clientes: clientes;
  clienteData: any = {};

  @ViewChild('clienteForm') clienteForm: NgForm | undefined; 

  @Output() clienteGuardado = new EventEmitter<boolean>();
  @Input() startLoading!: () => void;
  @Input() txtLoading: string = '';

  @Output() alertaEmitida = new EventEmitter<{ icon: SweetAlertIcon; title: string }>();

  sexoOptions = [
    { value: 'MASCULINO', label: 'MASCULINO' },
    { value: 'FEMENINO', label: 'FEMENINO' },
  ];

  constructor(
    private serviceActEcon: ActividadEconomicaService,
    private serviceEstadoCivil: EstadoCivilService,
    private clientesService: ClientesService
  ) {
    this.clientes = new clientes();
  }

  ngOnInit(): void {
    this.loadActividadesEconomicas();
    this.loadEstadoCivil();

    this.clientesService.clienteActual.subscribe(cliente => {
      console.log("datos::: ",cliente);
      if (cliente) {
        this.clienteData = cliente;
        this.clientes = { ...cliente };
      } else {
        this.clienteData = {};
      }
    });
  }

  ngAfterViewInit(): void {
    //setTimeout para que la vista se haya inicializado antes de trabajar con el formulario
    setTimeout(() => {
      if (this.clienteForm) {
        this.clienteForm.reset();
      }
    }, 0);
  }

  loadActividadesEconomicas(): void {
    this.serviceActEcon.findAll().subscribe({
      next: (actividadEconomica) => this.actividadEconomica = actividadEconomica,
      error: (error) => {
        console.error('Error al cargar actividades económicas:', error);
        alert('Ocurrió un error al cargar las actividades económicas.');
      }
    });
  }

  loadEstadoCivil(): void {
    this.serviceEstadoCivil.findAll().subscribe({
      next: (estadoCivil) => this.estadoCivil = estadoCivil,
      error: (error) => {
        console.error('Error al cargar estados civiles:', error);
        alert('Ocurrió un error al cargar los estados civiles.');
      }
    });
  }

  onSubmit(clienteForm: NgForm): void {
    if (clienteForm.valid) {
      if (this.clientes.id && this.clientes.id != 0) {
        this.txtLoading = "Actualizando Cliente";
        console.log('Actulizando datos');
        this.clientesService.update(this.clientes).subscribe({
          next: (clienteActualizado) => {
            console.log('Cliente actualizado:', clienteActualizado);
            this.clienteGuardado.emit(true);
            this.alertaEmitida.emit({ icon: 'success', title: 'Se actualizo el cliente con éxito' });
            clienteForm.reset();
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
            this.alertaFormCliente("Ocurrió un error al actualizar el cliente.");
            this.clienteGuardado.emit(false);
          }
        });
      }else{
        this.txtLoading = "Guadando Cliente";
        console.log('guardando datos');
        this.clientesService.save(this.clientes).subscribe({
          next: (nuevoCliente) => {
            this.clienteGuardado.emit(true);
            this.alertaEmitida.emit({ icon: 'success', title: 'Se guardó el cliente con éxito' });
            clienteForm.reset();
          },
          error: (error) => {
            console.error('Error al guardar cliente:', error);
            this.alertaFormCliente("Ocurrió un error al guardar el cliente.");
            this.clienteGuardado.emit(false);
          }
        });
      }
      
    } else {
      console.log('Formulario no válido:', clienteForm);
      this.clienteGuardado.emit(false);
    }
  }

  alertaFormCliente(texto: string){
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: texto,
    });
  }
}
