import {Usuario} from './usuario'
import { Tag } from './tag'

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
    tags:Array<Tag>;
}