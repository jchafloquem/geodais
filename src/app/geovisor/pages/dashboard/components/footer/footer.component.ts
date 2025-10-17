import { Component, Input } from '@angular/core'; // 1. Importa 'Input'

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Input() isMenuOpen: boolean = false; // 2. Añade esta línea para recibir la propiedad

  anioencurso: number = new Date().getFullYear();

  constructor() { }

}
