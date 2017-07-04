import {Usuario} from './usuario'

export class Idea{

    id: Object;
	contenido: string;
    estado : string;
    lugarEscritura: string;
    tipo: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;
    ideasProyecto: Array<Idea>;
    usuario: Usuario;
    lights: number;
    comentarios: number;
}