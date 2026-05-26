import { HttpClient } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { firstValueFrom } from 'rxjs';

//mapea la estructura que devuelve la api de opentdb para una pregunta
export interface PreguntaTrivia{
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface RespuestaTrivia{
  response_code: number;
  results: PreguntaTrivia[];
}

@Injectable({
  providedIn: 'root',
})
export class Trivia {
  private http = inject(HttpClient);
  //trae 10 preguntas,
  private url =  'https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple';

  //realiza peticion get a la api. firstValueFrom hace de traductor, async await funciona con promesas y http.get devuelve observables, entonces toma el primer valor del observable, cierra la conexion y devuelve una promise
  async obtenerPreguntas(): Promise<RespuestaTrivia> {
    return firstValueFrom(this.http.get<RespuestaTrivia>(this.url));
  }
}
