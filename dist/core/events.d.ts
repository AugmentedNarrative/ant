import { Ant } from "../ant";
import { Handler } from "./eventDispatcher";
export declare class AntEvents {
    ant: Ant;
    constructor(ant: Ant);
    /**
     * inicializar la function que escucha cuando el documento ya se inicializo
     */
    private initListenReadyDocument;
    /**dispatcher para el evento loadsuccess */
    private readyDocumentDispatcher;
    /** llamada del evento ReadyDocument */
    onLoadDocument(handler: Handler<ReadyDocumentEvent>): void;
}
/**
 * Los eventos como interfaces
 */
interface ReadyDocumentEvent {
}
export {};
