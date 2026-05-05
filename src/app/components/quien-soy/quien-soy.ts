import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quien-soy',
  imports: [CommonModule],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit{

  datosGithub: any;

  constructor(private http: HttpClient) {}
    ngOnInit(): void {
      this.http.get('https://api.github.com/users/martinsznesquivel').subscribe({
        next: (respuesta) => {
          this.datosGithub = respuesta;
        },
        error: (err) => {
          console.error('error', err)
        }
      });
    }
  }


