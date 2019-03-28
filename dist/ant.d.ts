import { AntEvents } from "./core/events";
import { AntElement } from "./core/element";
/**
 * representa al objeto ant que el usuario final instanciara en javascript
 *
 */
export declare class Ant {
    events: AntEvents;
    element: AntElement;
    /**
     *
     * @param opciones parametros necesarios para iniciar el objeto ant
     */
    constructor(opciones: any);
    private readItems_onLoad;
}
