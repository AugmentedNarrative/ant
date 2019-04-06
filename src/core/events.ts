import { Ant } from "../ant";
import { EventDispatcher, Handler } from "./eventDispatcher"
/**
 *represents the object that contains the events and properties required for Ant
 *
 * @export
 * @class AntEvents
 */
export class AntEvents {
    /**
     *Instance of the main Ant object
     *
     * @type {Ant}
     * @memberof AntEvents
     */
    ant: Ant;

    /**
     *dispatcher of the ReadyDocumentEvent
     *
     * @private
     * @memberof AntEvents
     */
    private readyDocumentDispatcher = new EventDispatcher<ReadyDocumentEvent>();

    /**
     *Creates an instance of AntEvents.
     * @param {Ant} ant
     * @memberof AntEvents
     */
    constructor(ant: Ant) {
        this.ant = ant;
        this.initListenReadyDocument();
    }

    /**
     *start listening to the DOMContentLoaded event
     *
     * @private
     * @memberof AntEvents
     */
    private initListenReadyDocument() {
        let th1 = this;
        document.addEventListener("DOMContentLoaded", function () {
            th1.readyDocumentDispatcher.fire({})
        }, false);
    }

    /**
     * start listen all events ant-onclick
     *
     * @memberof AntEvents
     */
    public addListenersToElementsOnClick(){
        let elements=document.querySelectorAll('[ant-onclick]');
        elements.forEach((ell)=>{
            ell.addEventListener("click",(event)=>{
                this.ant.element.parse(ell);
                return false;
            },false)
        })
    }
    
    /**
     * Rewritable function from the AntEvent instance<br>
     * for example:
     * ```javascript
     * var antEvent=new AntEvent(antInstance);
     * antevent.onLoadDocument(()=>{ 
     *      //code here...
     * });
     * ```
     * 
     * 
     * @param {Handler<ReadyDocumentEvent>} handler Promise function to call when the event is fulfilled
     * @memberof AntEvents
     */
    public onLoadDocument(handler: Handler<ReadyDocumentEvent>) {
        this.readyDocumentDispatcher.register(handler);
    }
}

/**
 * represents the structure of the event parameter
 *
 * @interface ReadyDocumentEvent
 */
interface ReadyDocumentEvent { }