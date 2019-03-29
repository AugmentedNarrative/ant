import { DebugElement } from "./debugClass";
export var DebugModule;
(function (DebugModule) {
    DebugModule.nameHook = "ant-debug";
    /**
     * initialize the element with hook named "ant-debug"
     *
     * @export
     * @param {Element} element
     * @param {Ant} ant
     */
    function init(element, ant) {
        var debug = new DebugElement(element, ant);
    }
    DebugModule.init = init;
})(DebugModule || (DebugModule = {}));
//# sourceMappingURL=debugModule.js.map