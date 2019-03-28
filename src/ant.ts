import {AntEvents} from "./core/events";
import {AntElement} from "./core/element";
import {ParsersModule} from "./parsers/parsersModule"

/**
 * representa al objeto ant que el usuario final instanciara en javascript
 *
 */
export class Ant {
    events:AntEvents;
    element:AntElement;
    /**
     * 
     * @param opciones parametros necesarios para iniciar el objeto ant
     */
    constructor(opciones:any) {
        this.element=new AntElement(this);
        this.events=new AntEvents(this);
        
        ParsersModule.initParsers(this);
        this.events.onLoadDocument(()=>{
            this.readItems_onLoad();
        });
    }

    private readItems_onLoad(){
        //TODO: parse elements with ant-onload, download data defined in options, etc.
        let elementos=document.querySelectorAll('[ant-onload]');
        elementos.forEach((ele)=>{
            this.element.parse(ele);
        });
    }

    

    
}
