import { Ant } from "../ant";

/**
 * AntElement representa al obejeto que registra y llama a los hooks
 * registrados en esta libreria
 */
export class AntElement {
    /**instancia del objeto principal ant */
    ant:Ant;
    /**objeto simple de javascript que almacena todos los hooks registrados en la librearia ant */
    hooks:any;
    /**
     * Constructor de AntElement
     * @param ant instancia del ant al que pertenecera este nuevo AntElement
     */
    constructor(ant:Ant) {
        this.ant=ant;
        this.hooks={};
    }

    public registerHook(hook:string,cb:Function){
        if (!this.hooks[hook]){
            this.hooks[hook] = [];
        }

        this.hooks[hook].push(cb);
    }

    public callHook(hook:string,element:Element){
        if (this.hooks && Object.keys(this.hooks).indexOf(hook) !== -1) { 
            for (var ix in this.hooks[hook]) { 
                this.hooks[hook][ix](element,this.ant);
            }
        }
    }

    public parse(element:Element){
        for (var x in element.attributes) {
            if (element.attributes[x].name && element.attributes[x].name.indexOf("ant-") === 0) {
                this.callHook (element.attributes[x].name, element);
            }
        }
    }
}