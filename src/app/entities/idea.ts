import {Usuario} from './usuario'
import { Tag } from './tag'

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
}