import { EventDispatcher } from "./eventDispatcher";
/**
 *represents the object that contains the events and properties required for Ant
 *
 * @export
 * @class AntEvents
 */
var AntEvents = /** @class */ (function () {
    /**
     *Creates an instance of AntEvents.
     * @param {Ant} ant
     * @memberof AntEvents
     */
    function AntEvents(ant) {
        /**
         *dispatcher of the ReadyDocumentEvent
         *
         * @private
         * @memberof AntEvents
         */
        this.readyDocumentDispatcher = new EventDispatcher();
        this.ant = ant;
        this.initListenReadyDocument();
    }
    /**
     *start listening to the DOMContentLoaded event
     *
     * @private
     * @memberof AntEvents
     */
    AntEvents.prototype.initListenReadyDocument = function () {
        var th1 = this;
        document.addEventListener("DOMContentLoaded", function () {
            th1.readyDocumentDispatcher.fire({});
        }, false);
    };
    /**
     * Rewritable function from the AntEvent instance\n
     * for example\n\n
     * 'let antEvent=new AntEvent(antInstance);
     *  antevent.onLoadDocument(()=>{ //code here...});'
     *
     * @param {Handler<ReadyDocumentEvent>} handler Promise function to call when the event is fulfilled
     * @memberof AntEvents
     */
    AntEvents.prototype.onLoadDocument = function (handler) {
        this.readyDocumentDispatcher.register(handler);
    };
    return AntEvents;
}());
export { AntEvents };
//# sourceMappingURL=events.js.map