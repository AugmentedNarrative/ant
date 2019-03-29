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
    

    

    
}
