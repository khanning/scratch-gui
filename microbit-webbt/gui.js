var GUI =
(window["webpackJsonpGUI"] = window["webpackJsonpGUI"] || []).push([[1],{

/***/ 1495:
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(1496);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(4)(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ 1496:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(false);
// imports


// module
exports.push([module.i, "html,\nbody,\n.index_app_3Qs6X {\n    /* probably unecessary, transitional until layout is refactored */\n    width: 100%; \n    height: 100%;\n    margin: 0;\n\n    /* Setting min height/width makes the UI scroll below those sizes */\n    min-width: 1024px;\n    min-height: 640px; /* Min height to fit sprite/backdrop button */\n}\n\n/* @todo: move globally? Safe / side FX, for blocks particularly? */\n\n* { -webkit-box-sizing: border-box; box-sizing: border-box; }\n", ""]);

// exports
exports.locals = {
	"app": "index_app_3Qs6X"
};

/***/ }),

/***/ 453:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(454);

__webpack_require__(456);

__webpack_require__(480);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(34);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _analytics = __webpack_require__(30);

var _analytics2 = _interopRequireDefault(_analytics);

var _gui = __webpack_require__(125);

var _gui2 = _interopRequireDefault(_gui);

var _hashParserHoc = __webpack_require__(160);

var _hashParserHoc2 = _interopRequireDefault(_hashParserHoc);

var _appStateHoc = __webpack_require__(161);

var _appStateHoc2 = _interopRequireDefault(_appStateHoc);

var _index = __webpack_require__(1495);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//if (process.env.NODE_ENV === 'production' && typeof window === 'object') {
// Warn before navigating away
// Polyfills
window.onbeforeunload = function () {
    return true;
};
//}

// Register "base" page view
// For Safari 9

_analytics2.default.pageview('/');

var appTarget = document.createElement('div');
appTarget.className = _index2.default.app;
document.body.appendChild(appTarget);

_gui2.default.setAppElement(appTarget);
var WrappedGui = (0, _hashParserHoc2.default)((0, _appStateHoc2.default)(_gui2.default));

// TODO a hack for testing the backpack, allow backpack host to be set by url param
var backpackHostMatches = window.location.href.match(/[?&]backpack_host=([^&]*)&?/);
var backpackHost = backpackHostMatches ? backpackHostMatches[1] : null;

var backpackOptions = {
    visible: true,
    host: backpackHost
};

_reactDom2.default.render(_react2.default.createElement(WrappedGui, { backpackOptions: backpackOptions }), appTarget);

/***/ }),

/***/ 482:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[453,0]]]);
//# sourceMappingURL=gui.js.map