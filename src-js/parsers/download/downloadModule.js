import { DownloadElement } from "./downloadClass";
/**
 * Modulo que contiene la inicializacion del parser Download
 */
export var DownloadModule;
(function (DownloadModule) {
    DownloadModule.nameHook = "ant-download";
    /**
     * initialize the element with hook named "ant-download"
     *
     * @export
     * @param {Element} element
     * @param {Ant} ant
     */
    function init(element, ant) {
        var debug = new DownloadElement(element, ant);
    }
    DownloadModule.init = init;
})(DownloadModule || (DownloadModule = {}));
//# sourceMappingURL=downloadModule.js.map