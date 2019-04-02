(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ant"] = factory();
	else
		root["ant"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ant.ts":
/*!********************!*\
  !*** ./src/ant.ts ***!
  \********************/
/*! exports provided: Ant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ant", function() { return Ant; });
/* harmony import */ var _core_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/events */ "./src/core/events.ts");
/* harmony import */ var _core_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/element */ "./src/core/element.ts");
/* harmony import */ var _parsers_parsersModule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parsers/parsersModule */ "./src/parsers/parsersModule.ts");
/* harmony import */ var _utils_dataset__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/dataset */ "./src/utils/dataset.ts");




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
        this.element = new _core_element__WEBPACK_IMPORTED_MODULE_1__["AntElement"](this);
        this.events = new _core_events__WEBPACK_IMPORTED_MODULE_0__["AntEvents"](this);
        _parsers_parsersModule__WEBPACK_IMPORTED_MODULE_2__["ParsersModule"].initParsers(this);
        this.events.onLoadDocument(function () {
            _this.parseItems_onLoad();
        });
        this.scope = { data: {}, callbacks: {}, elements: {} };
        if (options.hasOwnProperty('data')) {
            this.scope.data = options.data;
        }
        if (options.hasOwnProperty('callbacks')) {
            this.scope.callbacks = options.callbacks;
        }
        //lo listen ant-onclick events
        this.events.addListenersToElementsOnClick();
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
        var elements = document.querySelectorAll('[ant-onload]');
        elements.forEach(function (ele) {
            _this.element.parse(ele);
        });
    };
    /**
     * save an item to ant scope
     *
     * @param {string} group (data,callbacks or elements)
     * @param {*} item
     * @param {string} id accesible key
     * @returns {boolean} if saved or not saved
     * @memberof Ant
     */
    Ant.prototype.addItemToScope = function (group, item, id) {
        var saved = false;
        if (group == "data") {
            //only dataset objects
            if (item instanceof _utils_dataset__WEBPACK_IMPORTED_MODULE_3__["Dataset"]) {
                this.scope.data[id] = item;
                saved = true;
            }
            //console.log(item instanceof Dataset);
        }
        else if (group == "callbacks") {
            //only functions
            if (item instanceof Function) {
                this.scope.callbacks[id] = item;
                saved = true;
            }
        }
        else if (group == "elements") {
            this.scope.elements[id] = item;
            saved = true;
        }
        return saved;
    };
    return Ant;
}());



/***/ }),

/***/ "./src/core/element.ts":
/*!*****************************!*\
  !*** ./src/core/element.ts ***!
  \*****************************/
/*! exports provided: AntElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AntElement", function() { return AntElement; });
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
    /**
     * function that verifies what value the attribute has and decides if it parse it or calls it from the scope
     *
     * @param {string} attr
     * @memberof AntElement
     */
    AntElement.prototype.parseOrCallFnFromAttributeElement = function (attr, sender, data) {
        var _this = this;
        //verify if is selector or scope item of ant
        var elements = document.querySelectorAll(attr);
        if (elements.length > 0) {
            elements.forEach(function (ele) {
                _this.parse(ele);
            });
        }
        else {
            //is item scope (callback)
            var response = { sender: sender, data: data };
            this.ant.scope.callbacks[attr](response);
        }
    };
    return AntElement;
}());



/***/ }),

/***/ "./src/core/eventDispatcher.ts":
/*!*************************************!*\
  !*** ./src/core/eventDispatcher.ts ***!
  \*************************************/
/*! exports provided: EventDispatcher */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventDispatcher", function() { return EventDispatcher; });
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this.handlers = [];
    }
    EventDispatcher.prototype.fire = function (event) {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var h = _a[_i];
            h(event);
        }
    };
    EventDispatcher.prototype.register = function (handler) {
        this.handlers.push(handler);
    };
    return EventDispatcher;
}());



/***/ }),

/***/ "./src/core/events.ts":
/*!****************************!*\
  !*** ./src/core/events.ts ***!
  \****************************/
/*! exports provided: AntEvents */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AntEvents", function() { return AntEvents; });
/* harmony import */ var _eventDispatcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./eventDispatcher */ "./src/core/eventDispatcher.ts");

/**
 *represents the object that contains the events and properties required for Ant
 *
 * @export
 * @class AntEvents
 */
var AntEvents = /** @class */ (function () {
    /**
     *Creates an instance of AntEvents.
     * @param {Ant} ant
     * @memberof AntEvents
     */
    function AntEvents(ant) {
        /**
         *dispatcher of the ReadyDocumentEvent
         *
         * @private
         * @memberof AntEvents
         */
        this.readyDocumentDispatcher = new _eventDispatcher__WEBPACK_IMPORTED_MODULE_0__["EventDispatcher"]();
        this.ant = ant;
        this.initListenReadyDocument();
    }
    /**
     *start listening to the DOMContentLoaded event
     *
     * @private
     * @memberof AntEvents
     */
    AntEvents.prototype.initListenReadyDocument = function () {
        var th1 = this;
        document.addEventListener("DOMContentLoaded", function () {
            th1.readyDocumentDispatcher.fire({});
        }, false);
    };
    AntEvents.prototype.addListenersToElementsOnClick = function () {
        var _this = this;
        var elements = document.querySelectorAll('[ant-onclick]');
        elements.forEach(function (ell) {
            ell.addEventListener("click", function () {
                _this.ant.element.parse(ell);
                return false;
            }, false);
        });
    };
    /**
     * Rewritable function from the AntEvent instance\n
     * for example\n\n
     * 'let antEvent=new AntEvent(antInstance);
     *  antevent.onLoadDocument(()=>{ //code here...});'
     *
     * @param {Handler<ReadyDocumentEvent>} handler Promise function to call when the event is fulfilled
     * @memberof AntEvents
     */
    AntEvents.prototype.onLoadDocument = function (handler) {
        this.readyDocumentDispatcher.register(handler);
    };
    return AntEvents;
}());



/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: Ant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ant */ "./src/ant.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Ant", function() { return _ant__WEBPACK_IMPORTED_MODULE_0__["Ant"]; });





/***/ }),

/***/ "./src/parsers/debug/debugClass.ts":
/*!*****************************************!*\
  !*** ./src/parsers/debug/debugClass.ts ***!
  \*****************************************/
/*! exports provided: DebugElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DebugElement", function() { return DebugElement; });
/* harmony import */ var _parserClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parserClass */ "./src/parsers/parserClass.ts");
var __extends = (undefined && undefined.__extends) || (function () {
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
        var _this = _super.call(this, element, ant, "ant-debug") || this;
        _this.message = _this.element.getAttribute('ant-debug');
        console.log("ANT-DEBUG[" + _this.message + "]");
        return _this;
    }
    return DebugElement;
}(_parserClass__WEBPACK_IMPORTED_MODULE_0__["Parser"]));



/***/ }),

/***/ "./src/parsers/debug/debugModule.ts":
/*!******************************************!*\
  !*** ./src/parsers/debug/debugModule.ts ***!
  \******************************************/
/*! exports provided: DebugModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DebugModule", function() { return DebugModule; });
/* harmony import */ var _debugClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debugClass */ "./src/parsers/debug/debugClass.ts");

var DebugModule;
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
        var debug = new _debugClass__WEBPACK_IMPORTED_MODULE_0__["DebugElement"](element, ant);
    }
    DebugModule.init = init;
})(DebugModule || (DebugModule = {}));


/***/ }),

/***/ "./src/parsers/download/downloadClass.ts":
/*!***********************************************!*\
  !*** ./src/parsers/download/downloadClass.ts ***!
  \***********************************************/
/*! exports provided: DownloadElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DownloadElement", function() { return DownloadElement; });
/* harmony import */ var _utils_dataset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/dataset */ "./src/utils/dataset.ts");
/* harmony import */ var _parserClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../parserClass */ "./src/parsers/parserClass.ts");
var __extends = (undefined && undefined.__extends) || (function () {
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


/**
 * represent the element with hook named "ant-download"
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
         * property defined from [ ant-downlaod_format ]\n
         * format of the data : \n geojson,json,csv, etc
         *
         * @type {string}
         * @memberof DownloadElement
         */
        _this.format = "json";
        /**
         * indicates if dataset is ready
         *
         * @type {boolean}
         * @memberof DatasetContainer
         */
        _this.datasetIsReady = false;
        _this.url = _this.element.getAttribute(_this.nameHook);
        _this.format = (_this.element.getAttribute(_this.nameHook + "_format") == null) ? "json" : (_this.element.getAttribute(_this.nameHook + "_format"));
        _this.success = _this.element.getAttribute(_this.nameHook + "_success");
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
                    //save dataset
                    th1.dataset = new _utils_dataset__WEBPACK_IMPORTED_MODULE_0__["Dataset"](req.responseText, th1.format);
                    th1.datasetIsReady = true;
                    th1.datasetScopeAccesible = th1.id;
                    th1.getAnt().addItemToScope("data", th1.dataset, th1.datasetScopeAccesible);
                    //parse the elements
                    th1.getAnt().element.parseOrCallFnFromAttributeElement(th1.success, th1, th1.dataset);
                }
                else {
                    console.warn("error on XMLHttpRequest " + th1.url);
                }
            }
        };
        req.send(null);
    };
    return DownloadElement;
}(_parserClass__WEBPACK_IMPORTED_MODULE_1__["Parser"]));



/***/ }),

/***/ "./src/parsers/download/downloadModule.ts":
/*!************************************************!*\
  !*** ./src/parsers/download/downloadModule.ts ***!
  \************************************************/
/*! exports provided: DownloadModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DownloadModule", function() { return DownloadModule; });
/* harmony import */ var _downloadClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./downloadClass */ "./src/parsers/download/downloadClass.ts");

/**
 * Modulo que contiene la inicializacion del parser Download
 */
var DownloadModule;
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
        var debug = new _downloadClass__WEBPACK_IMPORTED_MODULE_0__["DownloadElement"](element, ant);
    }
    DownloadModule.init = init;
})(DownloadModule || (DownloadModule = {}));


/***/ }),

/***/ "./src/parsers/parserClass.ts":
/*!************************************!*\
  !*** ./src/parsers/parserClass.ts ***!
  \************************************/
/*! exports provided: Parser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return Parser; });
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
        this.id = "_";
        this.ant = ant;
        this.element = element;
        this.nameHook = nameHook;
        //verify if have id attr
        if (this.element.getAttribute("id") != null) {
            this.id = (this.element.getAttribute("id"));
            // can be saved in the ant scope if contains id
            this.storeInAnt();
        }
    }
    /**
     *returns instance main ant
     *
     * @returns {Ant} ant instance
     * @memberof Parser
     */
    Parser.prototype.getAnt = function () {
        return this.ant;
    };
    /**
     * this function save this element in ant.scope.elements\n
     * accesible with ant.scope.elements[id]
     *
     * @memberof Parser
     */
    Parser.prototype.storeInAnt = function () {
        //create key accesible
        var actualsize = Object.keys(this.ant.scope.elements).length;
        var key = this.id + "__" + actualsize;
        this.ant.scope.elements[key] = this;
        //and set in attributte to access
        var loquehay = this.element.getAttribute("ant___0initparse");
        var nuevoval = (loquehay == null) ? "" : loquehay;
        //console.log(1,nuevoval);
        nuevoval = (nuevoval.length > 0) ? nuevoval + "," + this.nameHook + ":" + key : this.nameHook + ":" + key;
        //console.log(2,nuevoval);
        this.element.setAttribute("ant___0initparse", nuevoval);
    };
    Parser.writeNewElementAttributes = function (element, attributes) {
        //first change the attrs and reload 
        attributes.forEach(function (attr) {
            element.setAttribute(attr.name, attr.value);
        });
        //reload
    };
    Parser.reload = function (ant, elements, attributes) {
        var rre = false;
        elements.forEach(function (ele) {
            var keys = Parser.getAccesKeysElement(ele);
            Parser.writeNewElementAttributes(ele, attributes);
            ant.element.parse(ele);
            rre = rre || true;
        });
        return rre;
    };
    /**
     * get Accesible Ant Scope Keys Element
     *
     * @static
     * @param {Element} element
     * @returns {any[]}
     * @memberof Parser
     */
    Parser.getAccesKeysElement = function (element) {
        var returns = [];
        var telem = element;
        var accesibles = telem.getAttribute("ant___0initparse") || "";
        if (accesibles.length > 0) {
            var hooks = accesibles.split(",");
            hooks.forEach(function (hook) {
                var acces = hook.split(":");
                returns.push(acces);
                //let obj=ant.scope.elements[acces[1]];
            });
        }
        return returns;
    };
    return Parser;
}());



/***/ }),

/***/ "./src/parsers/parsersModule.ts":
/*!**************************************!*\
  !*** ./src/parsers/parsersModule.ts ***!
  \**************************************/
/*! exports provided: ParsersModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParsersModule", function() { return ParsersModule; });
/* harmony import */ var _debug_debugModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debug/debugModule */ "./src/parsers/debug/debugModule.ts");
/* harmony import */ var _download_downloadModule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./download/downloadModule */ "./src/parsers/download/downloadModule.ts");
/* harmony import */ var _table_tableModule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./table/tableModule */ "./src/parsers/table/tableModule.ts");



var ParsersModule;
(function (ParsersModule) {
    /**
     *initialize all parsers
     *
     * @export
     * @param {Ant} ant instance of Ant object
     */
    function initParsers(ant) {
        ant.element.registerHook(_debug_debugModule__WEBPACK_IMPORTED_MODULE_0__["DebugModule"].nameHook, _debug_debugModule__WEBPACK_IMPORTED_MODULE_0__["DebugModule"].init);
        ant.element.registerHook(_download_downloadModule__WEBPACK_IMPORTED_MODULE_1__["DownloadModule"].nameHook, _download_downloadModule__WEBPACK_IMPORTED_MODULE_1__["DownloadModule"].init);
        ant.element.registerHook(_table_tableModule__WEBPACK_IMPORTED_MODULE_2__["TableModule"].nameHook, _table_tableModule__WEBPACK_IMPORTED_MODULE_2__["TableModule"].init);
    }
    ParsersModule.initParsers = initParsers;
})(ParsersModule || (ParsersModule = {}));


/***/ }),

/***/ "./src/parsers/table/tableClass.ts":
/*!*****************************************!*\
  !*** ./src/parsers/table/tableClass.ts ***!
  \*****************************************/
/*! exports provided: TableElement */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableElement", function() { return TableElement; });
/* harmony import */ var _parserClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../parserClass */ "./src/parsers/parserClass.ts");
/* harmony import */ var _utils_dataset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/dataset */ "./src/utils/dataset.ts");
var __extends = (undefined && undefined.__extends) || (function () {
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


/**
 *represent the element with hook named "ant-table"
 *
 * @export
 * @class TableElement
 * @extends {Parser}
 */
var TableElement = /** @class */ (function (_super) {
    __extends(TableElement, _super);
    function TableElement(element, ant) {
        var _this = _super.call(this, element, ant, "ant-table") || this;
        _this.dataset = _this.element.getAttribute(_this.nameHook + "_dataset") || "";
        var columns1 = _this.element.getAttribute(_this.nameHook + "_columns") || "";
        _this.columns = (typeof columns1 == "string") ? columns1.split(",") : [""];
        //verify type Dataset object
        //selector, ant.data scope or url
        //selector for extract data or name of data in scope
        if (_this.dataset.length > 0) {
            var dataset = _utils_dataset__WEBPACK_IMPORTED_MODULE_1__["Dataset"].extractDatasetFromElementOrScope(_this.getAnt(), _this.dataset);
            if (dataset == null || dataset == undefined) {
                console.warn("imposible read dataset from " + _this.dataset + " in table " + _this.id);
            }
            else {
                _this.render(dataset);
            }
        }
        else {
            console.warn("dataset for table: " + _this.id + " not defined");
        }
        return _this;
    }
    TableElement.prototype.render = function (dataset) {
        var columnasARenderear = (this.columns.length == 1 && this.columns[0] == "") ? dataset.columns : this.columns;
        var table;
        if (this.element.tagName == "table") {
            table = this.element;
        }
        else {
            table = document.createElement("table");
            this.element.appendChild(table);
        }
        var header = document.createElement("thead");
        var tbody = document.createElement("tbody");
        table.appendChild(header);
        table.appendChild(tbody);
        var header_tr = document.createElement("tr");
        header.appendChild(header_tr);
        columnasARenderear.forEach(function (columna) {
            var th1 = document.createElement("th");
            th1.appendChild(document.createTextNode(columna));
            header_tr.appendChild(th1);
        });
        var rows = dataset.data.map(function (datasetRow) {
            //fill row
            var row = document.createElement("tr");
            columnasARenderear.forEach(function (col) {
                var celda = document.createElement("td");
                //fill cell
                var text = document.createTextNode(datasetRow.getValue(col));
                celda.appendChild(text);
                row.appendChild(celda);
            });
            return row;
        });
        rows.forEach(function (rr) {
            tbody.appendChild(rr);
        });
        //listo ya esta llena la tabla
    };
    return TableElement;
}(_parserClass__WEBPACK_IMPORTED_MODULE_0__["Parser"]));



/***/ }),

/***/ "./src/parsers/table/tableModule.ts":
/*!******************************************!*\
  !*** ./src/parsers/table/tableModule.ts ***!
  \******************************************/
/*! exports provided: TableModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableModule", function() { return TableModule; });
/* harmony import */ var _tableClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tableClass */ "./src/parsers/table/tableClass.ts");

/**
 * Modulo que contiene la inicializacion del parser Table
 */
var TableModule;
(function (TableModule) {
    TableModule.nameHook = "ant-table";
    /**
     * initialize the element with hook named "ant-table"
     *
     * @export
     * @param {Element} element
     * @param {Ant} ant
     */
    function init(element, ant) {
        var debug = new _tableClass__WEBPACK_IMPORTED_MODULE_0__["TableElement"](element, ant);
    }
    TableModule.init = init;
})(TableModule || (TableModule = {}));


/***/ }),

/***/ "./src/utils/dataset.ts":
/*!******************************!*\
  !*** ./src/utils/dataset.ts ***!
  \******************************/
/*! exports provided: Dataset, RowDataset */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dataset", function() { return Dataset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RowDataset", function() { return RowDataset; });
var Dataset = /** @class */ (function () {
    function Dataset(data, format) {
        if (format === void 0) { format = "json"; }
        this.columns = [""];
        this.format = format;
        if (format == "geojson") {
            var data1 = JSON.parse(data);
            this.pureJson = data1;
            this.data = data1.features.map(function (feature) {
                return new RowDataset(feature, format);
            });
            this.isGeometry = true;
        }
        else if (format == "csv") {
            console.info("necesitamos crear un parser para tablas en formato csv");
            var data1 = [""];
            this.data = data1.map(function (feature) {
                return new RowDataset(feature, format);
            });
            this.isGeometry = true;
        }
        else {
            var data1 = JSON.parse(data);
            this.data = data1.map(function (item) {
                return new RowDataset(item, format);
            });
            this.isGeometry = false;
        }
        if (this.data.length > 0) {
            this.columns = this.data[0].keys;
        }
    }
    Dataset.extractDatasetFromElementOrScope = function (ant, dataset_attr) {
        var elems = document.querySelectorAll(dataset_attr);
        var datasetReturn = null;
        //debugger
        if (elems.length > 0) {
            elems.forEach(function (telem) {
                //verify if this element contains parsers 
                var accesibles = telem.getAttribute("ant___0initparse") || "";
                if (accesibles.length > 0) {
                    var hooks = accesibles.split(",");
                    hooks.forEach(function (hook) {
                        var acces = hook.split(":");
                        var obj = ant.scope.elements[acces[1]];
                        //verify instance with dataset
                        if ("datasetIsReady" in obj && "dataset" in obj) {
                            datasetReturn = obj.dataset;
                        }
                    });
                }
            });
        }
        if (datasetReturn == null) {
            datasetReturn = this.extractDatasetFromScope(ant, dataset_attr);
        }
        return datasetReturn;
    };
    Dataset.extractDatasetFromScope = function (ant, key) {
        return ant.scope.data[key];
    };
    return Dataset;
}());

var RowDataset = /** @class */ (function () {
    function RowDataset(object, format) {
        if (format === void 0) { format = "json"; }
        this.keys = [];
        this.object = {};
        this.geometry = null;
        if (format == "geojson") {
            this.geometry = object.geometry;
            this.initKeys(object.properties);
            this.object = object.properties;
        }
        else {
            this.initKeys(object);
            this.object = object;
        }
    }
    RowDataset.prototype.initKeys = function (object, omitirKey) {
        if (omitirKey === void 0) { omitirKey = ""; }
        for (var key in object) {
            this.keys.push(key);
        }
    };
    RowDataset.prototype.getValue = function (key) {
        //debugger
        //console.log(key,this.object);
        return this.object[key];
    };
    return RowDataset;
}());



/***/ })

/******/ });
});
//# sourceMappingURL=bundle.js.map