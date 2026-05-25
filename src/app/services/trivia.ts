import { HttpClient } from '@angular/common/http';
import { Injectable, inject} from '@angular/core';
import { firstValueFrom } from 'rxjs';

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
  private url =  'https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple';

  async obtenerPreguntas(): Promise<RespuestaTrivia> {
    return firstValueFrom(this.http.get<RespuestaTrivia>(this.url));
  }
}
