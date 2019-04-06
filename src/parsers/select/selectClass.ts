import { Parser } from "../parserClass";
import { Ant } from "../../ant";

export class SelectElement extends Parser{
    /**
     * property defined from [ ant-select ]\n
     * type: selector only
     * @type {string}
     * @memberof SelectElement
     */
    public selectorToModify:string;

    public attributesToChange?:Array<any>;

    /**
     *Creates an instance of SelectElement.
     * @param {Element} element
     * @param {Ant} ant
     * @memberof SelectElement
     */
    constructor(element:Element,ant:Ant){
        super(element,ant,"ant-select");
        this.setParserAttributes([
            {name:"",valueDefault:""}  //ant-select , required , element selector to set attributes
        ]);
        this.selectorToModify=this.getAttributeValue(this.nameHook);
        this.getAttributesToChange();
        this.change();
    }

    /**
     * get atributes to modify target elements
     *
     * @memberof SelectElement
     */
    public getAttributesToChange(){
        let nuevosAttrs=[];
        let attrs=this.element.attributes;
        for (let i=0;i<attrs.length;i++) {
            if(attrs[i].nodeName.indexOf(this.nameHook+"-set__")==0 || attrs[i].nodeName.indexOf("ant-set"+"__")==0){
                let name=attrs[i].nodeName.split("__")[1];
                nuevosAttrs.push({name:name,value:attrs[i].nodeValue})
            }
        }
        this.attributesToChange=nuevosAttrs;
    }
    /**
     * cahnge attributes and reload parser of elements
     *
     * @memberof SelectElement
     */
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