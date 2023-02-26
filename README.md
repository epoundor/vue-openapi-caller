# **OpenAPI Wrapper for Vue.js**

This package allows you to easily make calls to OpenAPI using Vue.js. It provides a simple and intuitive interface for making API calls and follows the best practices for integrating with the Vue.js lifecycle.

## **Installation**

To install the package, simply run the following command:

```bash
npm i vue-openapi-apicaller
```

## **Usage**

To use the package, first import it into your Vue component:

```jsx
import apiCaller from "vue-openapi-caller";
```

Next, define the API calls you want to make using an OpenAPI declaration file. This file should contain the parameters for your API calls and the actions to be taken upon success or failure.

After that, you can use the package's methods to make API calls and handle the responses:

Additionally, the package provides a comprehensive state management system, allowing you to keep track of the progress of your API calls.

## **Example**

```ts
import apiCAll from "vue-openapi-apicaller";
import declaration from "./declaration.ts";
import axios from "axios";
import { paths } from "./type";

const baseURL = "/";
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
const api = new ApiCAll<paths>(baseURL, axiosInstance);

const {
  data, //To handle all server response
  error, // To handle only error
  execute, // To execute the ajax request
  isAborted, // True when request is aborted
  isFinished, // True when request is finish
  isLoading, // True when request is loading
  registerSuccessCallback, // Hook to handle success response
  registerErrorCallback, // Hook to handle error response
  registerFailureCallback, // Hook to handle failure response
} = api.apiCall("/api/v1/user/{user_id}", {
  method: "get",
});
```

## **Recommended Usage**

Use hooks

```ts
// api/users
const api = new ApiCAll<paths>(baseURL, axiosInstance);

export function useFetchUsers() {
  return api.apiCall("/api/v1/user/", { method: "get" });
}
```

```html
<script setup>
  import { useFetchPosts } from "./api/users";
  import { onMounted } from "vue";
  const {
    execute: fetchUsers,
    registerErrorCallback: onError,
    registerSuccessCallback: onSuccess,
  } = useFecthUsers();

  onError((error) => {
    console.error("Something went wrong", error);
  });

  onSuccess((users) => {
    console.log("Users", users);
  });

  onMounted(() => {
    fetchUsers();
  });
</script>
```

## **Features**

- Simple and intuitive interface for making API calls
- Automatically handles errors and provides detailed information about any failures
- Comprehensive state management system
- Allows you to define your API calls using an easy-to-use OpenAPI declaration file

## **Note**

This package uses axios as a dependency to handle the http calls, so make sure you have it installed in your project.

## **Contributing**

If you have any suggestions or find any bugs, please feel free to open an issue or submit a pull request.

## **License**

This package is open-sourced software licensed under the **[MIT license](https://opensource.org/licenses/MIT)**.

## **Author**

This package is created and maintained by [Epoundor](https://github.com/epoundor)

Enjoy coding!
