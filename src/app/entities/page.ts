export class Page<T>{
    
    content: T[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    numberOfElements: number; // items in current page
    size: number; // items by page
    number: number; // actual page
}