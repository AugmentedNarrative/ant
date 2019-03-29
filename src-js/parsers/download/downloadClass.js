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
 *represent the element with hook named "ant-download"
 *
 * @export
 * @class DownloadElement
 * @extends {Parser}
 */
var DownloadElement = /** @class */ (function (_super) {
    __extends(DownloadElement, _super);
    /**
     * Creates an instance of DownloadElement.
     * @param {Element} element HtmlElement
     * @param {Ant} ant instance of ant main object
     * @memberof DownloadElement
     */
    function DownloadElement(element, ant) {
        var _this = _super.call(this, element, ant, "ant-download") || this;
        /**
         *format of the data : \n geojson,json,csv, etc
         *
         * @type {string}
         * @memberof DownloadElement
         */
        _this.format = "json";
        _this.url = _this.element.getAttribute(_this.nameHook);
        _this.format = (_this.element.getAttribute(_this.nameHook + "_format") == null) ? "json" : (_this.element.getAttribute(_this.nameHook + "_format"));
        _this.onSuccess = _this.element.getAttribute(_this.nameHook + "_success");
        _this.loadData();
        return _this;
    }
    /**
     * send xhr request
     *
     * @private
     * @memberof DownloadElement
     */
    DownloadElement.prototype.loadData = function () {
        var req = new XMLHttpRequest();
        var th1 = this;
        req.open("GET", this.url, true);
        req.onreadystatechange = function () {
            //on load all
            if (req.readyState == 4) {
                if (req.status == 200) {
                    //parse the elements
                    var elementos = document.querySelectorAll(th1.onSuccess);
                    elementos.forEach(function (ele) {
                        th1.ant.element.parse(ele);
                    });
                    console.log(req.responseText);
                }
                else {
                    console.warn("error on XMLHttpRequest " + th1.url);
                }
            }
        };
        req.send(null);
    };
    return DownloadElement;
}(Parser));
export { DownloadElement };
//# sourceMappingURL=downloadClass.js.map