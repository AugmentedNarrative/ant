export declare type Handler<E> = (event: E) => void;
export declare class EventDispatcher<E> {
    private handlers;
    fire(event: E): void;
    register(handler: Handler<E>): void;
}
