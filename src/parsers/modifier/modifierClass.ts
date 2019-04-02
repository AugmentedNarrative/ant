import { Parser } from "../parserClass";
import { Ant } from "../../ant";

export class ModifierElement extends Parser{
    /**
     * property defined from [ ant-modifier ]\n
     * type: selector only
     * @type {string}
     * @memberof ModifierElement
     */
    public selectorToModify:string;

    public attributesToChange?:Array<any>;

    /**
     *Creates an instance of ModifierElement.
     * @param {Element} element
     * @param {Ant} ant
     * @memberof ModifierElement
     */
    constructor(element:Element,ant:Ant){
        super(element,ant,"ant-modifier");
        this.selectorToModify=this.element.getAttribute(this.nameHook) || "";
        this.getAttributesToChange();
        this.change();
    }

    public getAttributesToChange(){
        let nuevosAttrs=[];
        let attrs=this.element.attributes;
        for (let i=0;i<attrs.length;i++) {
            if(attrs[i].nodeName.indexOf(this.nameHook+"__")==0){
                let name=attrs[i].nodeName.split("__")[1];
                nuevosAttrs.push({name:name,value:attrs[i].nodeValue})
            }
        }
        this.attributesToChange=nuevosAttrs;
    }

    public change(){
        let elements=document.querySelectorAll(this.selectorToModify);
        if(elements.length>0){
            let array1=[];
            for (let i = 0; i < elements.length; i++) {
                array1.push(elements[i]);
            }
            //console.log(elements);
            Parser.reload(this.getAnt(),array1,this.attributesToChange || []);
        }else{
            console.warn("target modifier not found");
        }
    }
}