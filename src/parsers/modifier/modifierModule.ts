import { ModifierElement } from "./modifierClass"
import { Ant } from "../../ant";

/**
 * Modulo que contiene la inicializacion del parser Modifier
 */
export module ModifierModule {
    
    export let nameHook = "ant-set";
    /**
     * initialize the element with hook named "ant-table"
     *
     * @export
     * @param {Element} element
     * @param {Ant} ant
     */
    export function init(element: Element, ant: Ant) {
        let debug = new ModifierElement(element, ant);
    }

}