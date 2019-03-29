/**
 * superclass that generalize Parser functions and properties
 *
 * @export
 * @class Parser
 */
var Parser = /** @class */ (function () {
    /**
     *Creates an instance of Parser.
     * @param {Element} element HtmlElement
     * @param {Ant} ant instance  of Ant object
     * @param {string} [nameHook="ant"]
     * @memberof Parser
     */
    function Parser(element, ant, nameHook) {
        if (nameHook === void 0) { nameHook = "ant"; }
        /**
         * identifier if element contains name-hook_id attribute
         *
         * @type {string}
         * @memberof Parser
         */
        this.id = "";
        this.ant = ant;
        this.element = element;
        this.nameHook = nameHook;
        //verificar si tiene id el elemento
        if (this.element.getAttribute(nameHook + "_id") != null) {
            this.id = (this.element.getAttribute(nameHook + "_id"));
        }
    }
    Parser.storeInAnt = function (parser) {
        // can be saved in the ant scope if contains id
    };
    return Parser;
}());
export { Parser };
//# sourceMappingURL=parserClass.js.map