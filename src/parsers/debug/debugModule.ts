import {DebugElement} from "./debugClass"
import { Ant } from "../../ant";
export module DebugModule{
    export let nameHook="ant-debug";
    export function init(element:Element,ant:Ant){
        let debug=new DebugElement(element,ant);
    }
    
}