import { Parser } from "../parserClass";
import { Ant } from "../../ant";
/**
 * parser ant-download
 */
export declare class DownloadElement extends Parser {
    url: any;
    onSuccess: any;
    format: string;
    constructor(element: Element, ant: Ant);
    private cargarDatos;
}
