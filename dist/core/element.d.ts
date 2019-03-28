import { Ant } from "../ant";
/**
 * AntElement representa al obejeto que registra y llama a los hooks
 * registrados en esta libreria
 */
export declare class AntElement {
    /**instancia del objeto principal ant */
    ant: Ant;
    /**objeto simple de javascript que almacena todos los hooks registrados en la librearia ant */
    hooks: any;
    /**
     * Constructor de AntElement
     * @param ant instancia del ant al que pertenecera este nuevo AntElement
     */
    constructor(ant: Ant);
    registerHook(hook: string, cb: Function): void;
    callHook(hook: string, element: Element): void;
    parse(element: Element): void;
}
