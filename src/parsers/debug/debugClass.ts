import { Parser } from "../parserClass";
import { Ant } from "../../ant";

export class DebugElement extends Parser {
    message: any;
    constructor(element:Element,ant:Ant) {
        super(element,ant)
        this.message=this.element.getAttribute('ant-debug');
        console.log("ANT-DEBUG["+this.message+"]");
    }
}