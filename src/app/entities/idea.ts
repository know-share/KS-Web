import { TrabajoGrado } from './trabajoGrado';
import {Usuario} from './usuario'
import { Tag } from './tag'

/**
 * Clase que representa 
 * una idea en el 
 * front-end
 */
export class Idea{

    id: string;
	contenido: string;
    estado : string;
    lugarEscritura: string;
    tipo: string;
    numeroEstudiantes: number;
    alcance: string;
    problematica: string;
    ideasProyecto: Array<Idea>;
    usuario: string;
    lights: number;
    comentarios: number;
    tags:Array<Tag>;
    isLight : boolean;
    usuarioOriginal: string;
    compartida:boolean;
    fechaCreacion:Date;
    tg:TrabajoGrado;
}