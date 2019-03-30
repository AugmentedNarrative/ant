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
    private ant:Ant;

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
    public id:string="_";

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
        //verify if have id attr
        if(this.element.getAttribute("id") != null){
            this.id=<string>(this.element.getAttribute("id"));
            // can be saved in the ant scope if contains id
            this.storeInAnt();
        }
    }
    
    /**
     *returns instance main ant
     *
     * @returns {Ant} ant instance
     * @memberof Parser
     */
    public getAnt():Ant{
        return this.ant;
    }

    /**
     * this function save this element in ant.scope.elements\n
     * accesible with ant.scope.elements[id]
     *
     * @memberof Parser
     */
    public storeInAnt(){
        this.ant.scope.elements[this.id]=this;
    }

}