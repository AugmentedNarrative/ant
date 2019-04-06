import { TableElement } from "./tableClass"
import { Ant } from "../../ant";

/**
 * Modulo que contiene la inicializacion del parser Table
 */
export module TableModule {
    
    export let nameHook = "ant-table";
    /**
     * initialize the element with hook named "ant-table"
     *
     * @export
     * @param {Element} element
     * @param {Ant} ant
     */
    export function init(element: Element, ant: Ant) {
        let debug = new TableElement(element, ant);
    }

}