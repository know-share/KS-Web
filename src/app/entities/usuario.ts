import { Carrera } from './carrera';
import { Personalidad } from './personalidad';
import { Gusto } from './gusto';
import { Enfasis } from './enfasis';
import { AreaConocimiento } from './areaConocimiento';
import { Habilidad } from './habilidad';
import { Cualidad } from './cualidad';

export class Usuario {

    nombre: string;
    apellido: string;
    email: string;
    password: string;
    username: string;

    tipoUsuario: string;
    carrera: Carrera;
    segundaCarrera: Carrera;
    semestre: number;
    seminario: boolean;
    temaTG: boolean;
    preferenciaIdea: string;

    personalidad: Personalidad;

    gustos: Gusto[];

    enfasis: Enfasis[];
    areasConocimiento: AreaConocimiento[];

    habilidades: Habilidad[];
    cualidades: Cualidad[];

    cantidadAmigos: number;
    amigos: string[];
    cantidadSeguidores: number;
    seguidores: string[];

    insignias: string[];

    constructor(){
        this.personalidad = new Personalidad();
        this.carrera = new Carrera();
    }
}