"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = exports.serverErrorTypeDetails = exports.ServerErrorType = void 0;
var ServerErrorType;
(function (ServerErrorType) {
    ServerErrorType["UNKNOWN_ERROR"] = "SER_0000";
    ServerErrorType["CONNOT_CONNECT"] = "SER_0001";
})(ServerErrorType = exports.ServerErrorType || (exports.ServerErrorType = {}));
exports.serverErrorTypeDetails = (_a = {},
    _a[ServerErrorType.UNKNOWN_ERROR] = {
        message: 'Unknown server error',
    },
    _a[ServerErrorType.CONNOT_CONNECT] = {
        message: 'Cannot connect to the server',
    },
    _a);
var ServerError = /** @class */ (function (_super) {
    __extends(ServerError, _super);
    function ServerError(errorCode, message, details) {
        var _this = _super.call(this) || this;
        _this.isServerError = true;
        _this.code = errorCode;
        _this.message = message !== null && message !== void 0 ? message : exports.serverErrorTypeDetails[errorCode].message;
        _this.details = details;
        return _this;
    }
    ServerError.prototype.toJSON = function () {
        var _a;
        return __assign(__assign({ isServerError: this.isServerError, code: this.code, message: "".concat(this.code, ": ").concat(this.message) }, ((_a = this.details) !== null && _a !== void 0 ? _a : {})), { stack: this.stack });
    };
    return ServerError;
}(Error));
exports.ServerError = ServerError;
