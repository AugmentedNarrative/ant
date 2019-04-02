import { Parser } from "../parserClass";
import { Ant } from "../../ant";
/**
 *represent the element with hook named "ant-debug"
 *
 * @export
 * @class DebugElement
 * @extends {Parser}
 */
export class DebugElement extends Parser {
    /**
     *the message to show in debug
     *
     * @type {*}
     * @memberof DebugElement
     */
    public message: any;

    /**
     *Creates an instance of DebugElement.
     * @param {Element} element HtmlElement
     * @param {Ant} ant instance of ant main object
     * @memberof DebugElement
     */
    constructor(element:Element,ant:Ant) {
        super(element,ant,"ant-debug");
        this.message=this.element.getAttribute('ant-debug');
        console.log("ANT-DEBUG["+this.message+"]");
    }
}