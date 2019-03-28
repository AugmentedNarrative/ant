import { Ant } from "../ant";
/**
 * superclase que cada parser debera heredar para retomar las propiedades  y funciones generales
 */
export declare class Parser {
    ant: Ant;
    element: Element;
    id: string;
    nameHook: string;
    constructor(element: Element, ant: Ant, nameHook?: string);
    static stored(parser: Parser): void;
}
