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
        //create key accesible
        let actualsize=Object.keys(this.ant.scope.elements).length;
        let key=this.id+"__"+actualsize;
        this.ant.scope.elements[key]=this;

        //and set in attributte to access
        let loquehay=this.element.getAttribute("ant___0initparse");
        let nuevoval:string=(loquehay==null)?"":<string>loquehay;
        //console.log(1,nuevoval);
        nuevoval=(nuevoval.length>0)?nuevoval+","+this.nameHook+":"+key:this.nameHook+":"+key;
        //console.log(2,nuevoval);
        this.element.setAttribute("ant___0initparse",nuevoval);
    }

    public static writeNewElementAttributes(element:Element,attributes:Array<any>){
        //first change the attrs and reload 
        attributes.forEach((attr)=>{
            element.setAttribute(attr.name,attr.value);
        })
        //reload
    }

    public static reload(ant:Ant,elements:Array<Element>,attributes:Array<any>):boolean{
        //debugger;
        let rre=false;
        elements.forEach((ele)=>{
            let keys=Parser.getAccesKeysElement(ele);
            //delete from scope with keys
            keys.forEach((kk)=>{
                delete ant.scope.elements[kk[1]];
            });
            //deleted accesible key attribute
            ele.setAttribute("ant___0initparse","");
            Parser.writeNewElementAttributes(ele,attributes);
            ant.element.parse(ele);
            rre=rre || true;
        })
        return rre;
    }

    /**
     * get Accesible Ant Scope Keys Element
     * 
     * @static
     * @param {Element} element
     * @returns {any[]}
     * @memberof Parser
     */
    public static getAccesKeysElement(element:Element):any[]{
        let returns:any[]=[];
        let telem=element;
        let accesibles:string=telem.getAttribute("ant___0initparse") || "";
                if(accesibles.length>0){
                    let hooks=accesibles.split(",");
                    hooks.forEach((hook)=>{
                        let acces=hook.split(":");
                        returns.push(acces);
                        //let obj=ant.scope.elements[acces[1]];
                        
                        
                    });
                }
        return returns;
    }
}