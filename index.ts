import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosProgressEvent,
} from "axios";
import { compile } from "path-to-regexp";
import { computed, reactive, type ComputedRef } from "vue";
import { paths, operations } from "./type";

const baseURL = "api/";
const axiosInstance = axios.create({
  baseURL: baseURL,
  // baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export function registerRequestInterceptor(
  onFulfilled:
    | ((
        value: AxiosRequestConfig
      ) => AxiosRequestConfig | Promise<AxiosRequestConfig>)
    | undefined,
  onError: ((error: AxiosError) => Promise<AxiosError>) | undefined = (
    error: AxiosError
  ) => Promise.reject(error)
) {
  axiosInstance.interceptors.request.use(onFulfilled, onError);
}

export function registerResponseInterceptor(
  onFulfilled:
    | ((
        value: AxiosResponse<any, any>
      ) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>)
    | undefined,
  onError: ((error: AxiosError) => Promise<AxiosError>) | undefined = (error) =>
    Promise.reject(error)
) {
  axiosInstance.interceptors.response.use(onFulfilled, onError);
}

type HTTPSuccess = 200 | 201 | 204;

type ApiResponse<Path, Method, Type = "application/json"> = Get<
  paths,
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

type Paths = keyof paths;
type MethodsForPath<P extends keyof paths> = keyof paths[P];

export type Methods = KeysOfUnion<paths[keyof paths]>;
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
type ApiParam<Path, Method, Parameter> = Get<
  paths,
  [Path, Method, "parameters", Parameter]
>;
type ApiRequestBody<Path, Method, Type = "application/json"> = Get<
  paths,
  [Path, Method, "requestBody", "content", Type]
>;

type Option<Path, Method> = RequestInit & {
  method: Method;
  headers?: Record<string, string>;
  immediate: boolean;
} & PickDefined<{
    query: ApiParam<Path, Method, "query">;
    params: ApiParam<Path, Method, "path">;
    data: ApiRequestBody<Path, Method, "application/json">;
  }>;

interface Context<Response> {
  isLoading: boolean;
  isFinished: boolean;
  isAborted: boolean;
  statusCode: number;
  response: AxiosResponse | null;
  data: Response | null;
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

export type ApiCall<P, M> = {
  // context: Omit<Context<T>, "data">;
  isLoading: ComputedRef<boolean>;
  isFinished: ComputedRef<boolean>;
  isAborted: ComputedRef<boolean>;
  statusCode: ComputedRef<number>;
  response: ComputedRef<AxiosResponse> | null;
  // data: T | unknown | null;
  error: ComputedRef<AxiosError> | null;
  data: ComputedRef<ApiResponse<P, M>> | ComputedRef<unknown> | null;
  execute: (
    config: Omit<Option<P, M>, "method" | "immediate">
  ) => Promise<void>;
  registerSuccessCallback: (cb: SuccessCallBack<P>) => unknown;
  registerFailureCallback: (cb: FailureCallBack) => unknown;
  registerErrorCallback: (cb: ErrorCallBack) => unknown;
  registerUploadProgressCallback: (cb: UploadProgressCallBack) => unknown;
};

export function apiCall<
  Path extends Paths,
  Method extends MethodsForPath<Path>
>(
  url: Path,
  options: Partial<Option<Path, Method>> & { method: Method }
  //   options: Partial<Option<PayloadType>> & { method: HttpMethod }
): ApiCall<Path, Method> {
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

  async function execute(
    // config?: Option<Path, Method>
    config?: Omit<Option<Path, Method>, "method" | "immediate">
  ): Promise<void> {
    const generateUrl = compile(String(url).replace("{", ":").replace("}", ""));

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
      data: options.data || {},
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
