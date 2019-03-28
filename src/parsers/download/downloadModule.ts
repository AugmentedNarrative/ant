import { DownloadElement } from "./downloadClass"
import { Ant } from "../../ant";

/**
 * Modulo que contiene la inicializacion del parser Download
 */
export module DownloadModule {
    
    export let nameHook = "ant-download";
    export function init(element: Element, ant: Ant) {
        let debug = new DownloadElement(element, ant);
    }

}