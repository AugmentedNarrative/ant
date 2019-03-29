var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Parser } from "../parserClass";
/**
 *represent the element with hook named "ant-debug"
 *
 * @export
 * @class DebugElement
 * @extends {Parser}
 */
var DebugElement = /** @class */ (function (_super) {
    __extends(DebugElement, _super);
    /**
     *Creates an instance of DebugElement.
     * @param {Element} element HtmlElement
     * @param {Ant} ant instance of ant main object
     * @memberof DebugElement
     */
    function DebugElement(element, ant) {
        var _this = _super.call(this, element, ant) || this;
        _this.message = _this.element.getAttribute('ant-debug');
        console.log("ANT-DEBUG[" + _this.message + "]");
        return _this;
    }
    return DebugElement;
}(Parser));
export { DebugElement };
//# sourceMappingURL=debugClass.js.map