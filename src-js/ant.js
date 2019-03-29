import { AntEvents } from "./core/events";
import { AntElement } from "./core/element";
import { ParsersModule } from "./parsers/parsersModule";
/**
 *represents the object 'Ant' that the end user will instantiate, when creating a 'new ANT', everything is initialized
 *
 * @export
 * @class Ant
 */
var Ant = /** @class */ (function () {
    /**
     *Creates an instance of Ant.
     * @param {*} options
     * @memberof Ant
     */
    function Ant(options) {
        var _this = this;
        this.element = new AntElement(this);
        this.events = new AntEvents(this);
        ParsersModule.initParsers(this);
        this.events.onLoadDocument(function () {
            _this.parseItems_onLoad();
        });
    }
    /**
     *call to start the parser of the DOM elements that have the attribute [ant-onload]
     *
     * @private
     * @memberof Ant
     */
    Ant.prototype.parseItems_onLoad = function () {
        var _this = this;
        //TODO: parse elements with ant-onload, download data defined in options, etc.
        var elementos = document.querySelectorAll('[ant-onload]');
        elementos.forEach(function (ele) {
            _this.element.parse(ele);
        });
    };
    return Ant;
}());
export { Ant };
//# sourceMappingURL=ant.js.map