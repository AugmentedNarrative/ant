import { DebugModule } from "./debug/debugModule";
import { DownloadModule } from "./download/downloadModule";
import { Ant } from "../ant";

export module ParsersModule{
    /**
     * inicializador de parsers
     * @param ant 
     */
    export function initParsers(ant:Ant){
        ant.element.registerHook(DebugModule.nameHook,DebugModule.init,);
        ant.element.registerHook(DownloadModule.nameHook,DownloadModule.init);
    }
}

