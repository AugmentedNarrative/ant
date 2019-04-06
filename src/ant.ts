import {AntEvents} from "./core/events";
import {AntElement} from "./core/element";
import {ParsersModule} from "./parsers/parsersModule"

/**
 *represents the object 'Ant' that the end user will instantiate, when creating a 'new ANT', everything is initialized
 *
 * @export
 * @class Ant
 */
export class Ant {
    /**
     *to initialize ant events
     *
     * @type {AntEvents}
     * @memberof Ant
     */
    events:AntEvents;
    /**
     *to initialize the ant hooks and parse Dom elements
     *
     * @type {AntElement}
     * @memberof Ants
     */
    element:AntElement;

        /**
     *
     *
     * @type {AntScope}
     * @memberof Ant
     */
    public scope!:AntScope;

    /**
     *Creates an instance of Ant.
     * @param {*} options 
     * @memberof Ant
     */
    constructor(options:any) {
        this.element=new AntElement(this);
        this.events=new AntEvents(this);
        ParsersModule.initParsers(this);
        this.events.onLoadDocument(()=>{
            this.parseItems_onLoad();
        });
        this.scope={data:{},callbacks:{},elements:{}};
        if( options.hasOwnProperty('data')){
            this.scope.data=options.data;
        }
        if( options.hasOwnProperty('callbacks')){
            this.scope.callbacks=options.callbacks;
        }
        //lo listen ant-onclick events
        this.events.addListenersToElementsOnClick();
    }

    /**
     *call to start the parser of the DOM elements that have the attribute [ant-onload]
     *
     * @private
     * @memberof Ant
     */
    private parseItems_onLoad(){
        //TODO: parse elements with ant-onload, download data defined in options, etc.
        let elements=document.querySelectorAll('[ant-onload]');
        elements.forEach((ele)=>{
            this.element.parse(ele);
        });
    }

    /**
     * save an item to ant scope
     *
     * @param {string} group (data,callbacks or elements)
     * @param {*} item 
     * @param {string} id accesible key
     * @returns {boolean} if saved or not saved
     * @memberof Ant
     */
    public addItemToScope(group:string, item:any,id:string):boolean{
        let saved=false;
        if(group=="data"){
            //only dataset objects
            this.scope.data[id]=item;
            saved=true
            //console.log(item instanceof Dataset);
        }else if(group=="callbacks"){
            //only functions
            if(item instanceof Function){
                this.scope.callbacks[id]=item;
                saved=true
            }
        }else if(group=="elements"){
            this.scope.elements[id]=item;
            saved=true
        }
        return saved;
    }
    

    

    
}

/**
 * Represnts scope object stored in ant
 *
 * @interface AntScope
 */
interface AntScope{
    data:any,
    callbacks:any,
    elements:any  
}