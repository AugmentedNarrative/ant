import { Ant } from "../ant";

/**
 *represent the object that initialize the ant hooks and parse Dom elements
 *
 * @export
 * @class AntElement
 */
export class AntElement {
    /**
     *Instance of the main Ant object
     *
     * @type {Ant}
     * @memberof AntEvents
     */
    ant:Ant;
    /**
     * simple javascript object that stores all registered hooks in the Ant library
     *
     * @type {*}
     * @memberof AntElement
     */
    hooks:any;
    /**
     *Creates an instance of AntElement.
     * @param {Ant} ant
     * @memberof AntElement
     */
    constructor(ant:Ant) {
        this.ant=ant;
        this.hooks={};
    }
    /**
    * registers a new hook type and its function that initializes it
    *
    * @param {string} hook name of hook \n e.g "ant-debug"
    * @param {Function} cb 
    * @memberof AntElement
    */
    public registerHook(hook:string,cb:Function){
        if (!this.hooks[hook]){
            this.hooks[hook] = [];
        }

        this.hooks[hook].push(cb);
    }

    /**
     * execute the function that initializes the parser of hook
     *
     * @param {string} hook name of hook \n e.g "ant-debug"
     * @param {Element} element 
     * @memberof AntElement
     */
    public callHook(hook:string,element:Element){
        if (this.hooks && Object.keys(this.hooks).indexOf(hook) !== -1) { 
            for (var ix in this.hooks[hook]) { 
                this.hooks[hook][ix](element,this.ant);
            }
        }
    }

    /**
     * search among all registered hooks, if that apply for this element
     *
     * @param {Element} element
     * @memberof AntElement
     */
    public parse(element:Element){
        for (var x in element.attributes) {
            if (element.attributes[x].name && element.attributes[x].name.indexOf("ant-") === 0) {
                this.callHook (element.attributes[x].name, element);
            }
        }
    }
}