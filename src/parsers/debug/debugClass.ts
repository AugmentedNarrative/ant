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
     *the message to show in console
     *
     * @type {*}
     * @memberof DebugElement
     */
    public message: string;

    /**
     *Creates an instance of DebugElement.
     * @param {Element} element HtmlElement
     * @param {Ant} ant instance of ant main object
     * @memberof DebugElement
     */
    constructor(element:Element,ant:Ant) {
        super(element,ant,"ant-debug");
        this.setParserAttributes([
            {name:"",valueDefault:"debug message"}
        ]);
        this.message=this.getAttributeValue("ant-debug");
        //console.log(this.message);
        console.log("ANT-DEBUG [%c"+this.message+"%c]" ,'background: #e9e9e9; color: blue','color:black');
    }
}

