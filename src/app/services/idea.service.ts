import { Tag } from './../entities/tag';
import { Http, Response, Headers } from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { URL_API } from '../entities/constants';

import {Idea} from '../entities/idea';
import {Comentario} from '../entities/comentario';

@Injectable()
export class IdeaService{
    
    baseUrl = URL_API + "/idea/";
    
    constructor(
        private http: Http
    ){}

    crearIdea(idea){
        let url = this.baseUrl +'crear';
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.post(url,idea,{
            headers : header
        })
            .map((res:Response) =>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 500){
                    throw new Error('No se pude crear la idea.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    findByUsuario(username : string){
        let url = this.baseUrl + 'findByUsuario/' + username;
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.get(url,{
            headers : header
        })
            .map((res : Response)=>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 204){
                    throw new Error('No hay ideas.');
                }
                if(res.status == 500){
                    throw new Error('No se pudieron cargar las ideas.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    findByUsuarioPro(username : string){
        let url = this.baseUrl + 'findByUsuarioPro/' + username;
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.get(url,{
            headers : header
        })
            .map((res : Response)=>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 204){
                    throw new Error('No hay ideas.');
                }
                if(res.status == 500){
                    throw new Error('No se pudieron cargar las ideas.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    findRed(){
        let url = this.baseUrl + 'findRed';
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.get(url,{
            headers : header
        })
            .map((res : Response)=>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 204){
                    throw new Error('No hay ideas.');
                }
                if(res.status == 500){
                    throw new Error('No se pudieron cargar las ideas.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    comentar(params : Comentario){
        let url = this.baseUrl + "comentar";
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.post(url,params,{
            headers:header
        }).map((res : Response)=>{
            if(res.status == 200){
                return res.json();
            }
            if(res.status == 500){
                throw new Error('No se pudo realizar el comentario.');
            }
        }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
        });
    }

    light(idea : Idea){
        let url = this.baseUrl + "light";
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.post(url,idea,{
            headers:header
        }).map((res : Response)=>{
            if(res.status == 200){
                return res.json();
            }
            if(res.status == 500){
                throw new Error('No se pudo realizar el light .');
            }
        }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
        });
    }

    findById(id : string){
        let url = this.baseUrl + "findById/" + id;
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.get(url,{
            headers:header
        }).map((res : Response) =>{
            if(res.status == 200){
                return res.json();
            }
            if(res.status == 500){
                throw new Error('no se pudo traer la idea.');
            }
        }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
        });

    }

    compartir(idea : Idea){
        let url = this.baseUrl + "compartir";
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.post(url,idea,{
            headers:header
        }).map((res : Response)=>{
            if(res.status == 200){
                return res.json();
            }
            if(res.status == 500){
                throw new Error('No se pudo compartir.');
            }
        }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
        });
    }

    findOperacion(id : string, tipo:string){
        let url = this.baseUrl + "findOperacion/" + id+"/"+tipo;
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.get(url,{
            headers:header
        }).map((res : Response) =>{
            if(res.status == 200){
                return res.json();
            }
            if(res.status == 500){
                throw new Error('no se pudieron traer las operaciones.');
            }
        }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
        });

    }

    cambiarEstado(idea:Idea){
        let url = this.baseUrl + "cambiarestado";
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.put(url,idea,{
            headers:header
        }).map((res : Response) =>{
            if(res.status == 200){
                return res.json();
            }
        }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
        });
    }

    findByTags(tags:Array<Tag>){
        let url = this.baseUrl + 'findByTags';
        let header = new Headers();
        header.append('Authorization',localStorage.getItem('token'));
        return this.http.post(url,tags,{
            headers : header
        })
            .map((res : Response)=>{
                if(res.status == 200){
                    return res.json();
                }
                if(res.status == 204){
                    throw new Error('No hay ideas.');
                }
                if(res.status == 500){
                    throw new Error('No se pudieron cargar las ideas.');
                }
            }).catch((err:Response) =>{
                if(err.status == 401)
                    throw new Error(err.status.toString());
                throw Error(err.toString());
            });
    }

    
}