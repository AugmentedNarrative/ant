import {DebugElement} from "./debugClass"
import { Ant } from "../../ant";

export module DebugModule{

    export let nameHook="ant-debug";
    
    /**
     * initialize the element with hook named "ant-debug"
     *
     * @export
     * @param {Element} element
     * @param {Ant} ant
     */
    export function init(element:Element,ant:Ant){
        let debug=new DebugElement(element,ant);
    }
    
}