"use strict";
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
exports.ApiCAll = void 0;
var axios_1 = require("axios");
var path_to_regexp_1 = require("path-to-regexp");
var vue_1 = require("vue");
var ApiCAll = /** @class */ (function () {
    function ApiCAll(baseUrl, axiosInstance) {
        if (baseUrl === void 0) { baseUrl = ""; }
        if (axiosInstance === void 0) { axiosInstance = axios_1["default"].create({
            withCredentials: true,
            baseURL: baseUrl,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        }); }
        this.axiosInstance = axiosInstance;
    }
    /**
     * Registers request interceptors for axios library
     * @function
     * @param {function} [onFulfilled] - A function to be called when the request is fulfilled.
     * It takes an AxiosRequestConfig object as its parameter, and returns an AxiosRequestConfig object or a promise that resolves to an AxiosRequestConfig object.
     * @param {function} [onError=Promise.reject(error)] - A function to be called when the request is rejected.
     * It takes an AxiosError object as its parameter, and returns a promise that resolves to an AxiosError object.
     */
    ApiCAll.prototype.registerRequestInterceptor = function (onFulfilled, onError) {
        if (onError === void 0) { onError = function (error) { return Promise.reject(error); }; }
        this.axiosInstance.interceptors.request.use(onFulfilled, onError);
    };
    /**
     * Registers response interceptors for axios library
     * @function
     * @param {function} [onFulfilled] - A function to be called when the response is fulfilled.
     * It takes an AxiosResponse object as its parameter, and returns an AxiosResponse object or a promise that resolves to an AxiosResponse object.
     * @param {function} [onError=Promise.reject(error)] - A function to be called when the response is rejected.
     * It takes an AxiosError object as its parameter, and returns a promise that resolves to an AxiosError object.
     */
    ApiCAll.prototype.registerResponseInterceptor = function (onFulfilled, onError) {
        if (onError === void 0) { onError = function (error) { return Promise.reject(error); }; }
        this.axiosInstance.interceptors.response.use(onFulfilled, onError);
    };
    /**
     * This function is an API call utility that utilizes the axios library to make HTTP requests. It takes in two parameters: a url of type Path and an options object of type Partial<Option<Path, Method>> & { method: Method }. The function then creates four arrays to store callbacks for different events: success, failure, error, and upload progress. It also creates a reactive context object to store data related to the API call, such as the response, data, error, and loading status.
     *The function then defines an execute() method that takes an optional config object of type Omit<Option<Path, Method>, "method" | "immediate">. This method generates a URL using the compile() function and sets up the configuration options for the axios request, including the URL, method, data, headers, and onUploadProgress event. It then sets the context's isLoading property to true and makes the request using the axiosInstance. If the request is successful, it will call the success callbacks and update the context object with the response data and status code. If there's an error, it will call the failure or error callbacks and update the context object with the error.
     *The function also includes four methods for registering callbacks for each event: registerSuccessCallback(), registerFailureCallback(), registerErrorCallback(), and registerUploadProgressCallback().
     */
    ApiCAll.prototype.vFetch = function (url, options
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
        var axiosInstance = this.axiosInstance;
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
                            paramsToUse = (config === null || config === void 0 ? void 0 : config.params) ||
                                options.params ||
                                {};
                            routeParamsKeys = Object.keys(paramsToUse);
                            if (routeParamsKeys.length > 0) {
                                routeParamsKeys.forEach(function (key) {
                                    stringifiedRouteParams[key] = paramsToUse[key].toString();
                                });
                            }
                            requestConfig = {
                                url: generateUrl(stringifiedRouteParams ||
                                    (config === null || config === void 0 ? void 0 : config.params)),
                                method: String(options.method) || "GET",
                                params: __assign(__assign({}, config === null || config === void 0 ? void 0 : config.params), config === null || config === void 0 ? void 0 : config.query) ||
                                    options.params ||
                                    {},
                                data: options.body || {},
                                headers: options.headers || {},
                                onUploadProgress: function (progressEvent) {
                                    uploadProgessCallbacks.forEach(function (cb) {
                                        cb(progressEvent);
                                    });
                                }
                            };
                            if (config &&
                                (config === null || config === void 0 ? void 0 : config.data)) {
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
    };
    return ApiCAll;
}());
exports.ApiCAll = ApiCAll;
