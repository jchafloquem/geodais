import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { isRequired } from '../../utils/validators';
import { Usuario } from '../../interfaces/usuario';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';

@Component({
    imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export default class LoginComponent implements OnInit, OnDestroy {
	private _formBuilder = inject(FormBuilder);
	private _router = inject(Router);
	private _http = inject(HttpClient);

	isRequired(field: 'usuario' | 'password'): boolean | null {
		return isRequired(field, this.form);
	}

	public form = this._formBuilder.nonNullable.group({
		usuario: this._formBuilder.nonNullable.control('', [Validators.required]),
		password: this._formBuilder.nonNullable.control('', [Validators.required])
	});

  private readonly backgroundImages = [
    'assets/images/wallpapers/wallpaper1.png',
    'assets/images/wallpapers/wallpaper2.png',
    'assets/images/wallpapers/wallpaper3.png',
    'assets/images/wallpapers/wallpaper2.png' // Se repite para el efecto de ida y vuelta
  ];

  public backgrounds = [
    { url: '', fade: false },
    { url: '', fade: false }
  ];

  private intervalId: any;
  private imageIndex = 0;
  private activeBgIndex = 0;

  ngOnInit(): void {
    this.startImageCarousel();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startImageCarousel(): void {
    this.backgrounds[0].url = `url('${this.backgroundImages[this.imageIndex]}')`;
    this.backgrounds[1].url = '';
    this.backgrounds[0].fade = false; // Visible
    this.backgrounds[1].fade = true;  // Oculto
    this.activeBgIndex = 0;

    const intervalDuration = 8750; // 8.75 segundos por imagen

    this.intervalId = setInterval(() => {
      this.imageIndex = (this.imageIndex + 1) % this.backgroundImages.length;
      const nextBgIndex = (this.activeBgIndex + 1) % 2;
      this.backgrounds[nextBgIndex].url = `url('${this.backgroundImages[this.imageIndex]}')`;
      this.backgrounds[this.activeBgIndex].fade = true;
      this.backgrounds[nextBgIndex].fade = false;
      this.activeBgIndex = nextBgIndex;
    }, intervalDuration);
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      toast.warning('Por favor, complete todos los campos.');
      return;
    }
    try {
      const { usuario, password } = this.form.value;
      if (!usuario || !password) return;

      // URL relativa para que sea interceptada por el proxy (local y en Netlify).
      const apiUrl = 'https://wsautenticacionside.devida.gob.pe/api/Seguridad/AutenticarSIGA';
      const body = {
        login: usuario,
        clave: password
      };

      const response = await lastValueFrom(this._http.post<Usuario>(apiUrl, body));

      if (response && response.Autenticado) {
        // Guardar solo el token y la información no sensible del usuario en localStorage.
        localStorage.setItem('authToken', response.Token);

        // Se crea un objeto solo con los datos necesarios para la UI, evitando exponer datos sensibles.
        const userSession = {
          NombreCompleto: response.NombreCompleto,
        };
        localStorage.setItem('userSessionData', JSON.stringify(userSession));

        toast.success(`Bienvenido, ${response.NombreCompleto}`);

        const redirectUrl = localStorage.getItem('redirectUrl') || '/geovisor/map';
        localStorage.removeItem('redirectUrl');
        this._router.navigateByUrl(redirectUrl);
      } else {
        toast.error(response.Mensaje || 'Credenciales incorrectas.');
      }
    } catch (error) {
      toast.error('Error de conexión. No se pudo autenticar.');
    }
  }

}
