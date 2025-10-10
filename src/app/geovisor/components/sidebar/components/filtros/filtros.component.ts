import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { GeovisorSharedService } from '../../../../services/geovisor.service';

@Component({
  selector: 'app-filtros',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.scss'
})
export class FiltrosComponent implements OnInit {
  public _geovisorSharedService = inject(GeovisorSharedService);

  public oficinas: { nombre: string }[] = [];
  public selectedOficina: string | null = null;
  public isLoading = true;

  ngOnInit(): void {
    this.cargarOficinas();
  }

  private async cargarOficinas(): Promise<void> {
    this.isLoading = true;
    try {
      this.oficinas = await this._geovisorSharedService.getOficinasZonales();
    } catch (error) {
      console.error("Error en el componente al cargar oficinas", error);
    } finally {
      this.isLoading = false;
    }
  }

  buscarOficina(): void {
    if (this.selectedOficina) {
      this._geovisorSharedService.zoomToOficinaZonal(this.selectedOficina);
    } else {
      this._geovisorSharedService.showToast('Por favor, seleccione una oficina zonal.', 'info', true);
    }
  }

  limpiarFiltro(): void {
    this.selectedOficina = null;
    this._geovisorSharedService.clearHighlights();
  }
}
