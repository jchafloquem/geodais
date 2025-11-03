import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeovisorSharedService } from '../../services/geovisor.service';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FabContainerTopComponent } from '../../components/fab-container-top/fab-container-top.component';
import { InfoCoordenadasComponent } from '../../components/info-coordenadas/info-coordenadas.component';
import { Usuario } from '../../../auth/interfaces/usuario';
import { AuthStateService } from '../../../auth/shared/access/auth-state.service';


@Component({
  standalone: true,
  selector: 'app-map',
  imports: [
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    FabContainerTopComponent,
    InfoCoordenadasComponent,
    CommonModule,
  ],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  public capasVisibles: __esri.FeatureLayer[] = [];
  private _authStateService = inject(AuthStateService);
  public _geovisorSharedService = inject(GeovisorSharedService);

  public usuario: Usuario | null = null;
  public tiempoSesion = '';
  private sesionInicio!: number;
  private intervaloSesion!: ReturnType<typeof setInterval>;
  public toogle = false;

  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  // ⚡ Aquí inicializamos el mapa SOLO cuando el DOM ya existe
  ngAfterViewInit(): void {
    this._geovisorSharedService.initializeMap(this.mapViewEl);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this._geovisorSharedService.dataImport(file);
    }
  }
  ngOnDestroy(): void {
    // Destruye la vista usando el servicio
    this._geovisorSharedService.destroyMap();
    // Limpia el intervalo de sesión
    clearInterval(this.intervaloSesion);
  }

}
