export interface IRegistro {
  email: string;
  password: string;
  nombre: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface Carta {
  numero: number;
  palo: string;
}