import { Component, inject, OnInit } from '@angular/core';
import { Github } from '../../services/github';

@Component({
  selector: 'app-quien-soy',
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit{  
  githubService = inject(Github);

  ngOnInit(){
    this.githubService.obtenerUsuarioGithub()
  }
}
