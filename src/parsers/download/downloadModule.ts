import { DownloadElement } from "./downloadClass"
import { Ant } from "../../ant";

/**
 * Modulo que contiene la inicializacion del parser Download
 */
export module DownloadModule {
    
    export let nameHook = "ant-download";
    /**
     * initialize the element with hook named "ant-download"
     *
     * @export
     * @param {Element} element
     * @param {Ant} ant
     */
    export function init(element: Element, ant: Ant) {
        let debug = new DownloadElement(element, ant);
    }

}