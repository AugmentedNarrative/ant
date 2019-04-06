import { SelectElement } from "./selectClass"
import { Ant } from "../../ant";

/**
 * Modulo que contiene la inicializacion del parser Select
 */
export module SelectModule {
    
    export let nameHook = "ant-select";
    /**
     * initialize the element with hook named "ant-table"
     *
     * @export
     * @param {Element} element
     * @param {Ant} ant
     */
    export function init(element: Element, ant: Ant) {
        let debug = new SelectElement(element, ant);
    }

}