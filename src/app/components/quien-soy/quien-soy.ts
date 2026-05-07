import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit {
  datosGithub: any;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}
  //ChangeDetectorRef obliga a angular a actualizar la vista (sin esto la foto del usuario no carga a no ser que presionemos dos veces quien soy)
  ngOnInit(): void {
    this.http.get('https://api.github.com/users/martinsznesquivel').subscribe({
      next: (respuesta) => {
        this.datosGithub = respuesta;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('error', err);
      },
    });
  }
}
