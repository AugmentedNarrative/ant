import { Ant } from "../ant";

/**
 * superclase que cada parser debera heredar para retomar las propiedades  y funciones generales
 */
export class Parser {
    ant:Ant;
    public element:Element;
    public id:string="";
    public nameHook:string;
    constructor(element:Element,ant:Ant, nameHook:string="ant") {
        this.ant=ant;
        this.element=element;
        this.nameHook=nameHook;
        //verificar si tiene id el elemento
        if(this.element.getAttribute(nameHook+"_id") != null){
            this.id=<string>(this.element.getAttribute(nameHook+"_id"));
            Parser.stored(this);
        }
    }

    public static stored(parser:Parser){
        (<any> window).ant_stored= (<any> window).ant_stored || {};
        (<any> window).ant_stored[parser.id]=parser;
    }

}