import { Ant } from "../ant";
import { EventDispatcher, Handler } from "./eventDispatcher"
export class AntEvents {
    ant: Ant;
    constructor(ant: Ant) {
        this.ant = ant;
        this.initListenReadyDocument();
    }
    /**
     * inicializar la function que escucha cuando el documento ya se inicializo
     */
    private initListenReadyDocument() {
        let th1 = this;
        document.addEventListener("DOMContentLoaded", function () {
            th1.readyDocumentDispatcher.fire({})
        }, false);
    }

    /**dispatcher para el evento loadsuccess */
    private readyDocumentDispatcher = new EventDispatcher<ReadyDocumentEvent>();
    /** llamada del evento ReadyDocument */
    public onLoadDocument(handler: Handler<ReadyDocumentEvent>) {
        this.readyDocumentDispatcher.register(handler);
    }
}

/**
 * Los eventos como interfaces
 */
interface ReadyDocumentEvent { }