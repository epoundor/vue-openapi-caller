import type { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosProgressEvent,
} from "axios";
import { compile } from "path-to-regexp";
import { computed, reactive, type ComputedRef } from "vue";

type HTTPSuccess = 200 | 201 | 204;
type ApiResponse<D, Path, Method, Type = "application/json"> = Get<
  D,
  [Path, Method, "responses", HTTPSuccess, "content", Type]
>;
// Extrait la liste des clefs requises
type RequiredKeys<T> = {
  [K in keyof T]-?: T extends Record<K, T[K]> ? K : never;
}[keyof T];
// Vérifie si toutes les sous clef sont requise dans T, renvoie never si ce n'est pas le cas
type AllRequiredKey<T> = {
  [K in keyof T]: RequiredKeys<T[K]> extends never ? K : never;
}[keyof T];
// Rend certaines clefs optionnelles
type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
// Rend les clefs, qui n'ont que des valeurs optionnelles, optionnelles
type OptionalDeep<T> = Optional<T, AllRequiredKey<T>>;
// Retire les valeur "never" des clefs d'un objet
type PickDefined<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends never ? never : K }[keyof T]
>;

// Trouve les valeurs qui sont dans tous les ensembles T
type KeysOfUnion<T> = T extends T ? keyof T : never;

type MethodsForPath<P extends keyof D, D> = keyof D[P];

// export type Methods = KeysOfUnion<paths[keyof paths]>;
// interface Option<PayloadType> {
//   immediate: boolean;
//   method: HttpMethod;
//   params: Record<string, string | number>;
//   headers: Record<string, string | number>;
//   params: Record<string, string | number>;
//   data: PayloadType;
// }

// Trouve le type d'une valeur en profondeur dans un object Get<obj, ["player", "firstname"]>
type Get<T extends any, K extends any[], D = never> = K extends []
  ? T
  : K extends [infer A, ...infer B]
  ? A extends keyof T
    ? Get<T[A], B>
    : D
  : D;
type ApiParam<D, Path, Method, Parameter> = Get<
  D,
  [Path, Method, "parameters", Parameter]
>;
type ApiRequestBody<D, Path, Method, Type = "application/json"> = Get<
  D,
  [Path, Method, "requestBody", "content", Type]
>;

type Option<D, Path, Method> = RequestInit & {
  method: Method;
  headers?: Record<string, string> | AxiosHeaders;
  // immediate: boolean;
} & PickDefined<{
    query: ApiParam<D, Path, Method, "query">;
    params: ApiParam<D, Path, Method, "path">;
    body: ApiRequestBody<D, Path, Method, "application/json">;
  }>;

interface Context<Response> {
  isLoading: boolean;
  isFinished: boolean;
  isAborted: boolean;
  statusCode: number;
  response: AxiosResponse | null;
  data: Response | null | unknown;
  error: AxiosError | null;
}

export type SuccessCallBack<T> = (
  data: T,
  response: AxiosResponse,
  axiosInstance: AxiosInstance
) => unknown;
export type ErrorCallBack = (error: AxiosError) => unknown;
export type FailureCallBack = (data: any, response: AxiosResponse) => unknown;
export type UploadProgressCallBack = (
  progressEvent: AxiosProgressEvent
) => unknown;

export type ApiCall<D, P, M, R> = {
  // context: Omit<Context<T>, "data">;
  isLoading: ComputedRef<boolean>;
  isFinished: ComputedRef<boolean>;
  isAborted: ComputedRef<boolean>;
  statusCode: ComputedRef<number>;
  response: ComputedRef<AxiosResponse> | null;
  // data: T | unknown | null;
  error: ComputedRef<AxiosError> | null;
  data: ComputedRef<ApiResponse<D, P, M>> | ComputedRef<unknown> | null;
  execute: (
    config: Omit<Option<D, P, M>, "method" | "immediate">
  ) => Promise<void>;
  registerSuccessCallback: (
    cb: SuccessCallBack<ApiResponse<D, P, M>>
  ) => unknown;
  registerFailureCallback: (cb: FailureCallBack) => unknown;
  registerErrorCallback: (cb: ErrorCallBack) => unknown;
  registerUploadProgressCallback: (cb: UploadProgressCallBack) => unknown;
};

export class ApiCAll<DeclarationPath> {
  private axiosInstance: AxiosInstance;
  constructor(baseUrl: string = "") {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  /**
   * Registers request interceptors for axios library
   * @function
   * @param {function} [onFulfilled] - A function to be called when the request is fulfilled.
   * It takes an AxiosRequestConfig object as its parameter, and returns an AxiosRequestConfig object or a promise that resolves to an AxiosRequestConfig object.
   * @param {function} [onError=Promise.reject(error)] - A function to be called when the request is rejected.
   * It takes an AxiosError object as its parameter, and returns a promise that resolves to an AxiosError object.
   */
  registerRequestInterceptor(
    onFulfilled:
      | ((
          value: AxiosRequestConfig
        ) => AxiosRequestConfig | Promise<AxiosRequestConfig>)
      | undefined,
    onError: ((error: AxiosError) => Promise<AxiosError>) | undefined = (
      error: AxiosError
    ) => Promise.reject(error)
  ) {
    this.axiosInstance.interceptors.request.use(onFulfilled, onError);
  }

  /**
   * Registers response interceptors for axios library
   * @function
   * @param {function} [onFulfilled] - A function to be called when the response is fulfilled.
   * It takes an AxiosResponse object as its parameter, and returns an AxiosResponse object or a promise that resolves to an AxiosResponse object.
   * @param {function} [onError=Promise.reject(error)] - A function to be called when the response is rejected.
   * It takes an AxiosError object as its parameter, and returns a promise that resolves to an AxiosError object.
   */

  registerResponseInterceptor(
    onFulfilled:
      | ((
          value: AxiosResponse<any, any>
        ) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>)
      | undefined,
    onError: ((error: AxiosError) => Promise<AxiosError>) | undefined = (
      error
    ) => Promise.reject(error)
  ) {
    this.axiosInstance.interceptors.response.use(onFulfilled, onError);
  }

  /**
   * This function is an API call utility that utilizes the axios library to make HTTP requests. It takes in two parameters: a url of type Path and an options object of type Partial<Option<Path, Method>> & { method: Method }. The function then creates four arrays to store callbacks for different events: success, failure, error, and upload progress. It also creates a reactive context object to store data related to the API call, such as the response, data, error, and loading status.
   *The function then defines an execute() method that takes an optional config object of type Omit<Option<Path, Method>, "method" | "immediate">. This method generates a URL using the compile() function and sets up the configuration options for the axios request, including the URL, method, data, headers, and onUploadProgress event. It then sets the context's isLoading property to true and makes the request using the axiosInstance. If the request is successful, it will call the success callbacks and update the context object with the response data and status code. If there's an error, it will call the failure or error callbacks and update the context object with the error.
   *The function also includes four methods for registering callbacks for each event: registerSuccessCallback(), registerFailureCallback(), registerErrorCallback(), and registerUploadProgressCallback().
   */
  apiCall<
    Response,
    Path extends keyof DeclarationPath,
    Method extends MethodsForPath<Path, DeclarationPath>
  >(
    url: Path,
    options: Option<DeclarationPath, Path, Method> & { method: Method }
    //   options: Partial<Option<PayloadType>> & { method: HttpMethod }
  ): ApiCall<DeclarationPath, Path, Method, Response> {
    const successCallbacks: Function[] = [];
    const failureCallbacks: Function[] = [];
    const errorCallbacks: Function[] = [];
    const uploadProgessCallbacks: Function[] = [];

    //   const { params = options.params } = options;
    //   const { immediate = false, params } = options;

    const context = reactive<Context<Response>>({
      isLoading: false,
      isFinished: false,
      isAborted: false,
      statusCode: 0,
      response: null,
      data: null,
      error: null,
    });
    const axiosInstance = this.axiosInstance;
    async function execute(
      // config?: Option<Path, Method>
      config?: Omit<
        Option<DeclarationPath, Path, Method>,
        "method" | "immediate"
      >
    ): Promise<void> {
      const generateUrl = compile(
        String(url).replace("{", ":").replace("}", "")
      );

      const stringifiedRouteParams: Record<string, string> = {};

      const paramsToUse = config?.params || options.params || {};

      const routeParamsKeys = Object.keys(paramsToUse);

      if (routeParamsKeys.length > 0) {
        routeParamsKeys.forEach((key) => {
          stringifiedRouteParams[key] = paramsToUse[key].toString();
        });
      }

      const requestConfig: AxiosRequestConfig = {
        url: generateUrl(stringifiedRouteParams || config?.params),
        method: options.method || "GET",
        params: config?.params || options.params || {},
        data: options.body || {},
        headers: options.headers || {},
        onUploadProgress(progressEvent: AxiosProgressEvent) {
          uploadProgessCallbacks.forEach((cb) => {
            cb(progressEvent);
          });
        },
      };

      if (config?.data) {
        if (requestConfig.method?.toLowerCase() === "get") {
          requestConfig.params = config.data;
        } else {
          requestConfig.data = config.data;
        }
      }

      // if (config.url) {
      //   requestConfig.url = `${requestConfig.url}/${config.url}`;
      // }

      context.isLoading = true;

      try {
        const response = await axiosInstance(requestConfig);

        context.response = response;
        context.data = response.data;
        context.statusCode = response.status;

        successCallbacks.forEach((cb) => {
          cb(context.data, context.response, axiosInstance);
        });

        context.isLoading = false;
        context.isFinished = true;
      } catch (error) {
        const axiosError = error as AxiosError;
        context.isLoading = false;
        context.isFinished = true;
        if (axiosError.response) {
          context.response = axiosError.response;
          context.statusCode = axiosError.response.status;
          context.data = axiosError.response.data;

          failureCallbacks.forEach((cb) => {
            cb(context.data, context.response);
          });
        } else {
          context.error = axiosError;
          errorCallbacks.forEach((cb) => {
            cb(context.error);
          });
        }
      }
    }

    function registerSuccessCallback(cb: Function) {
      successCallbacks.push(cb);
    }

    function registerFailureCallback(cb: Function) {
      failureCallbacks.push(cb);
    }

    function registerErrorCallback(cb: Function) {
      errorCallbacks.push(cb);
    }

    function registerUploadProgressCallback(cb: Function) {
      uploadProgessCallbacks.push(cb);
    }

    return {
      // ...toRefs(context),
      isLoading: computed(() => context.isLoading),
      isFinished: computed(() => context.isFinished),
      isAborted: computed(() => context.isAborted),
      statusCode: computed(() => context.statusCode),
      response: computed(() => context.response as AxiosResponse),
      // data: T | unknown | null;
      error: computed(() => context.error as AxiosError),
      data: computed(() => context.data),
      execute,
      registerSuccessCallback,
      registerFailureCallback,
      registerErrorCallback,
      registerUploadProgressCallback,
    };
  }
}
