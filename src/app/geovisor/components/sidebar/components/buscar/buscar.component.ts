import { Component, AfterViewInit, ElementRef, inject, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GeovisorSharedService } from '../../../../services/geovisor.service';


@Component({
  selector: 'app-buscar',
  // Asumo que es standalone porque está en los imports de sidebar.component.ts
  standalone: true,
  imports: [],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuscarComponent implements AfterViewInit {
  // Obtenemos la referencia al elemento del template
  @ViewChild('searchWidget') searchWidgetEl!: ElementRef<HTMLElement>;

  private geovisorService = inject(GeovisorSharedService);

  ngAfterViewInit(): void {
    // Nos aseguramos de que el elemento exista antes de inicializar
    if (this.searchWidgetEl) {
      this.geovisorService.initializeSearchWidget(this.searchWidgetEl.nativeElement);
    }
  }
}
