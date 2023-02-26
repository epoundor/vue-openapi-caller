# **OpenAI API Wrapper for Vue.js**

This package allows you to easily make calls to OpenAI API using Vue.js. It provides a simple and intuitive interface for making API calls and follows the best practices for integrating with the Vue.js lifecycle.

## **Installation**

To install the package, simply run the following command:

```bash
npm i vue-openai-apicaller
```

## **Usage**

To use the package, first import it into your Vue component:

```jsx
import apiCaller from "vue-openai-apicaller";
```

Next, define the API calls you want to make using an OpenAI declaration file. This file should contain the parameters for your API calls and the actions to be taken upon success or failure.

After that, you can use the package's methods to make API calls and handle the responses:

```

```

Additionally, the package provides a comprehensive state management system, allowing you to keep track of the progress of your API calls.

## **Example**

```jsx
import apiCaller from 'vue-openai-apicaller'
import declaration from './declaration.ts'

export default {
  data() {
    return {
      response: null,
      error: null,
      isLoading: false,
    }
  },
  methods: {
    makeApiCall() {
        this.isLoading = true
        openAI.makeApiCall(declarationFile)
        .then(response => {
          this.response = response
        }).catch(error => {
          this.error = error
        }).finally(() => {
          this.isLoading = false
        });
    }
  }
}

```

## **Features**

- Simple and intuitive interface for making API calls
- Automatically handles errors and provides detailed information about any failures
- Comprehensive state management system
- Allows you to define your API calls using an easy-to-use OpenAI declaration file

## **Note**

This package uses axios as a dependency to handle the http calls, so make sure you have it installed in your project.

## **Contributing**

If you have any suggestions or find any bugs, please feel free to open an issue or submit a pull request.

## **License**

This package is open-sourced software licensed under the **[MIT license](https://opensource.org/licenses/MIT)**.

## **Author**

This package is created and maintained by [Epoundor](https://github.com/epoundor)

Enjoy coding!
