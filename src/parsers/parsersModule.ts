import { DebugModule } from "./debug/debugModule";
import { DownloadModule } from "./download/downloadModule";
import { TableModule } from "./table/tableModule";
import { Ant } from "../ant";


export module ParsersModule{
    /**
     *initialize all parsers
     *
     * @export
     * @param {Ant} ant instance of Ant object
     */
    export function initParsers(ant:Ant){
        ant.element.registerHook(DebugModule.nameHook,DebugModule.init,);
        ant.element.registerHook(DownloadModule.nameHook,DownloadModule.init);
        ant.element.registerHook(TableModule.nameHook,TableModule.init);
    }
}

