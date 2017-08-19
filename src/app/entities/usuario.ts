import { Carrera } from './carrera';
import { Personalidad } from './personalidad';
import { Gusto } from './gusto';
import { Enfasis } from './enfasis';
import { AreaConocimiento } from './areaConocimiento';
import { Habilidad } from './habilidad';
import { Cualidad } from './cualidad';
import { TrabajoGrado } from './trabajoGrado';
import { FormacionAcademica } from './formacionAcademica';
import { Insignia } from './insignia';

class InfoUsuario{
    username:string;
    nombre:string;
}

export class Usuario {

    id: Object;

    nombre: string;
    apellido: string;
    email: string;
    password: string;
    username: string;
    genero: string;
    grupoInvestigacion: string;

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
    amigos: InfoUsuario[];
    cantidadSeguidores: number;
    seguidores: InfoUsuario[];
    siguiendo: InfoUsuario[];

    solicitudesAmistad: string[];

    insignias: Insignia[];

    tgDirigidos:TrabajoGrado[];
    formacionAcademica:FormacionAcademica[];
    
    imagen:boolean;

    constructor(){
        this.personalidad = new Personalidad();
        this.carrera = new Carrera();
    }
}