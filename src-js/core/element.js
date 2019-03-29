/**
 *represent the object that initialize the ant hooks and parse Dom elements
 *
 * @export
 * @class AntElement
 */
var AntElement = /** @class */ (function () {
    /**
     *Creates an instance of AntElement.
     * @param {Ant} ant
     * @memberof AntElement
     */
    function AntElement(ant) {
        this.ant = ant;
        this.hooks = {};
    }
    /**
    * registers a new hook type and its function that initializes it
    *
    * @param {string} hook name of hook \n e.g "ant-debug"
    * @param {Function} cb
    * @memberof AntElement
    */
    AntElement.prototype.registerHook = function (hook, cb) {
        if (!this.hooks[hook]) {
            this.hooks[hook] = [];
        }
        this.hooks[hook].push(cb);
    };
    /**
     * execute the function that initializes the parser of hook
     *
     * @param {string} hook name of hook \n e.g "ant-debug"
     * @param {Element} element
     * @memberof AntElement
     */
    AntElement.prototype.callHook = function (hook, element) {
        if (this.hooks && Object.keys(this.hooks).indexOf(hook) !== -1) {
            for (var ix in this.hooks[hook]) {
                this.hooks[hook][ix](element, this.ant);
            }
        }
    };
    /**
     * search among all registered hooks, if that apply for this element
     *
     * @param {Element} element
     * @memberof AntElement
     */
    AntElement.prototype.parse = function (element) {
        for (var x in element.attributes) {
            if (element.attributes[x].name && element.attributes[x].name.indexOf("ant-") === 0) {
                this.callHook(element.attributes[x].name, element);
            }
        }
    };
    return AntElement;
}());
export { AntElement };
//# sourceMappingURL=element.js.map