import { Ant } from "../ant";

/**
 * superclass that generalize Parser functions and properties  
 *
 * @export
 * @class Parser
 */
export class Parser {
    /**
     * instance of ant object
     *
     * @type {Ant}
     * @memberof Parser
     */
    public ant:Ant;

    /**
     * the HtmlElement
     *
     * @type {Element}
     * @memberof Parser
     */
    public element:Element;

    /**
     * identifier if element contains name-hook_id attribute
     *
     * @type {string}
     * @memberof Parser
     */
    public id:string="";

    /**
     *name of main hook of the element
     *
     * @type {string}
     * @memberof Parser
     */
    public nameHook:string;
    /**
     *Creates an instance of Parser.
     * @param {Element} element HtmlElement
     * @param {Ant} ant instance  of Ant object
     * @param {string} [nameHook="ant"]
     * @memberof Parser
     */
    constructor(element:Element,ant:Ant, nameHook:string="ant") {
        this.ant=ant;
        this.element=element;
        this.nameHook=nameHook;
        //verificar si tiene id el elemento
        if(this.element.getAttribute(nameHook+"_id") != null){
            this.id=<string>(this.element.getAttribute(nameHook+"_id"));
        }
    }

    public static storeInAnt(parser:Parser){
        // can be saved in the ant scope if contains id
    }

}