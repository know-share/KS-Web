import { Tag } from './tag'

export class TrabajoGrado{
    
    id: Object;
	nombre:string;
	periodoFin:string;
	resumen:string;
	numEstudiantes:number;
	tags:Array<Tag>;
	descripción:string[];
}