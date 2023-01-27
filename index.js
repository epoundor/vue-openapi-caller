"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.apiCall = exports.registerResponseInterceptor = exports.registerRequestInterceptor = void 0;
var axios_1 = require("axios");
var path_to_regexp_1 = require("path-to-regexp");
var vue_1 = require("vue");
var baseURL = "api/";
var axiosInstance = axios_1["default"].create({
    baseURL: baseURL,
    // baseURL: "/api/",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});
function registerRequestInterceptor(onFulfilled, onError) {
    if (onError === void 0) { onError = function (error) { return Promise.reject(error); }; }
    axiosInstance.interceptors.request.use(onFulfilled, onError);
}
exports.registerRequestInterceptor = registerRequestInterceptor;
function registerResponseInterceptor(onFulfilled, onError) {
    if (onError === void 0) { onError = function (error) {
        return Promise.reject(error);
    }; }
    axiosInstance.interceptors.response.use(onFulfilled, onError);
}
exports.registerResponseInterceptor = registerResponseInterceptor;
function apiCall(url, options
//   options: Partial<Option<PayloadType>> & { method: HttpMethod }
) {
    var successCallbacks = [];
    var failureCallbacks = [];
    var errorCallbacks = [];
    var uploadProgessCallbacks = [];
    //   const { params = options.params } = options;
    //   const { immediate = false, params } = options;
    var context = (0, vue_1.reactive)({
        isLoading: false,
        isFinished: false,
        isAborted: false,
        statusCode: 0,
        response: null,
        data: null,
        error: null
    });
    function execute(
    // config?: Option<Path, Method>
    config) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var generateUrl, stringifiedRouteParams, paramsToUse, routeParamsKeys, requestConfig, response, error_1, axiosError;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        generateUrl = (0, path_to_regexp_1.compile)(String(url).replace("{", ":").replace("}", ""));
                        stringifiedRouteParams = {};
                        paramsToUse = (config === null || config === void 0 ? void 0 : config.params) || options.params || {};
                        routeParamsKeys = Object.keys(paramsToUse);
                        if (routeParamsKeys.length > 0) {
                            routeParamsKeys.forEach(function (key) {
                                stringifiedRouteParams[key] = paramsToUse[key].toString();
                            });
                        }
                        requestConfig = {
                            url: generateUrl(stringifiedRouteParams || (config === null || config === void 0 ? void 0 : config.params)),
                            method: options.method || "GET",
                            params: (config === null || config === void 0 ? void 0 : config.params) || options.params || {},
                            data: options.data || {},
                            headers: options.headers || {},
                            onUploadProgress: function (progressEvent) {
                                uploadProgessCallbacks.forEach(function (cb) {
                                    cb(progressEvent);
                                });
                            }
                        };
                        if (config === null || config === void 0 ? void 0 : config.data) {
                            if (((_a = requestConfig.method) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "get") {
                                requestConfig.params = config.data;
                            }
                            else {
                                requestConfig.data = config.data;
                            }
                        }
                        // if (config.url) {
                        //   requestConfig.url = `${requestConfig.url}/${config.url}`;
                        // }
                        context.isLoading = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axiosInstance(requestConfig)];
                    case 2:
                        response = _b.sent();
                        context.response = response;
                        context.data = response.data;
                        context.statusCode = response.status;
                        successCallbacks.forEach(function (cb) {
                            cb(context.data, context.response, axiosInstance);
                        });
                        context.isLoading = false;
                        context.isFinished = true;
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        axiosError = error_1;
                        context.isLoading = false;
                        context.isFinished = true;
                        if (axiosError.response) {
                            context.response = axiosError.response;
                            context.statusCode = axiosError.response.status;
                            context.data = axiosError.response.data;
                            failureCallbacks.forEach(function (cb) {
                                cb(context.data, context.response);
                            });
                        }
                        else {
                            context.error = axiosError;
                            errorCallbacks.forEach(function (cb) {
                                cb(context.error);
                            });
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function registerSuccessCallback(cb) {
        successCallbacks.push(cb);
    }
    function registerFailureCallback(cb) {
        failureCallbacks.push(cb);
    }
    function registerErrorCallback(cb) {
        errorCallbacks.push(cb);
    }
    function registerUploadProgressCallback(cb) {
        uploadProgessCallbacks.push(cb);
    }
    //   if (immediate) {
    //     const o = {
    //       headers: {},
    //       ...options,
    //     } as RequestInit & {
    //       json?: object;
    //       headers: Record<string, string>;
    //       query?: Record<string, any>;
    //       params?: Record<string, any>;
    //     };
    //     const query = o.query;
    //     const params = o.params;
    //     let newurl = baseURL + url;
    //     o.headers["Accept"] = "application/json";
    //     // Si on a une clef json, alors la requête aura un body json
    //     if (o.json) {
    //       o.body = JSON.stringify(o.json);
    //       o.headers["Content-Type"] = "application/json";
    //     }
    //     // On ajoute les query parameters à l'URL
    //     if (query) {
    //       const params = new URLSearchParams();
    //       Object.keys(query).forEach((k: string) => {
    //         if (query[k] !== undefined) {
    //           params.set(k, query[k]);
    //         }
    //       });
    //       newurl += `?${params.toString()}`;
    //     }
    //     // On remplace les paramètres dans l'url ("/path/{id}" par exemple)
    //     if (params) {
    //       Object.keys(params).forEach(
    //         (k) => (newurl = url.replace(`{${k}}`, params[k]))
    //       );
    //     }
    //     setTimeout(() => execute(o), 0);
    //   }
    return {
        // ...toRefs(context),
        isLoading: (0, vue_1.computed)(function () { return context.isLoading; }),
        isFinished: (0, vue_1.computed)(function () { return context.isFinished; }),
        isAborted: (0, vue_1.computed)(function () { return context.isAborted; }),
        statusCode: (0, vue_1.computed)(function () { return context.statusCode; }),
        response: (0, vue_1.computed)(function () { return context.response; }),
        // data: T | unknown | null;
        error: (0, vue_1.computed)(function () { return context.error; }),
        data: (0, vue_1.computed)(function () { return context.data; }),
        execute: execute,
        registerSuccessCallback: registerSuccessCallback,
        registerFailureCallback: registerFailureCallback,
        registerErrorCallback: registerErrorCallback,
        registerUploadProgressCallback: registerUploadProgressCallback
    };
}
exports.apiCall = apiCall;
