export interface Nave {
    id: number;
    nombre: string;
    imagen: string;
    costo: number;
    ataqueBase: number;
    vida: number;
    vidaMax: number;
    isCooldown: boolean;
    seleccionada: boolean;
}

export interface Planeta {
    id: number;
    nombre: string;
    imagen: string;
    hp: number;
    hpMax: number;
    defensa:number;
    conquistado: boolean;
    seleccionado: boolean;
}