import { DebugModule } from "./debug/debugModule";
import { DownloadModule } from "./download/downloadModule";
export var ParsersModule;
(function (ParsersModule) {
    /**
     *initialize all parsers
     *
     * @export
     * @param {Ant} ant instance of Ant object
     */
    function initParsers(ant) {
        ant.element.registerHook(DebugModule.nameHook, DebugModule.init);
        ant.element.registerHook(DownloadModule.nameHook, DownloadModule.init);
    }
    ParsersModule.initParsers = initParsers;
})(ParsersModule || (ParsersModule = {}));
//# sourceMappingURL=parsersModule.js.map