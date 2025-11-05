import {
	Component,
	inject,
	CUSTOM_ELEMENTS_SCHEMA,
	AfterViewInit,
	ViewChild,
	ElementRef,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GeovisorSharedService } from '../../services/geovisor.service';
import { AuthStateService } from '../../../auth/shared/access/auth-state.service';
import { reactiveUtils } from '../../interfaces/arcgis-imports';

@Component({
	selector: 'app-navbar',
	imports: [RouterModule],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.scss',
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavbarComponent implements AfterViewInit {
	@ViewChild('arcgisSearch')
	private arcgisSearchEl!: ElementRef<HTMLArcgisSearchElement>;
	private _authState = inject(AuthStateService);
	private _router = inject(Router);

	public _geovisorSharedService = inject(GeovisorSharedService);

	async logout(): Promise<void> {
		await this._authState.logout();
		this._router.navigateByUrl('auth/welcome');
	}

	ngAfterViewInit(): void {
		if (!this.arcgisSearchEl) {
			return;
		}

		const searchElement = this.arcgisSearchEl.nativeElement;

		// Escuchamos el evento que se dispara cuando el usuario selecciona un resultado.
		searchElement.addEventListener('arcgisSelectResult', () => {
			const view = this._geovisorSharedService.view;
			if (view) {
				// El componente de búsqueda navega automáticamente. Usamos reactiveUtils
				// para esperar a que la vista del mapa deje de navegar.
				reactiveUtils.whenOnce(() => !view.navigating).then(() => {
					// Forzamos un redibujado del mapa. Un pequeño retardo ayuda a que
					// Safari procese la desaparición del panel de sugerencias.
					setTimeout(() => {
						// Forzamos el redibujado. Usamos `as any` para evitar el error de TypeScript,
						// ya que el método `resize()` sí existe en el objeto real en tiempo de ejecución.
						(view as any).resize();
					}, 150); // 150ms es un valor seguro.
				});
			}
		});
	}
}

interface HTMLArcgisSearchElement extends HTMLElement {
	view?: __esri.MapView;
}
